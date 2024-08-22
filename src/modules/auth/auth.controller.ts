import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IResponse } from 'src/common/interface/response.interface';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from '../admin/admin.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { CustomValidationPipe } from 'src/common/pipes/validation.pipe';
import { authLoginValidation } from './validations/auth.validation';
import { NodeMailerHelper } from 'src/common/helpers/nodemailer.helper';
import { render } from '@react-email/components';
import { PasswordForgotDto } from './dto/password-forgot.dto';
import {
  passwordChangeValidation,
  passwordForgotValidation,
  passwordResetValidation,
} from './validations/password.validation';
import MepResetPasswordEmail from 'template/forgort_password.template';
import { AdminDocument } from '../admin/schema/admin.schema';
import { UpdatePasswordDto } from './dto/password-reset.dto';
import { links } from 'template/assets/items';
import { ChangePasswordDto } from './dto/password-change.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly passwordHelper: PasswordHelper,
    private readonly nodeMailerHelper: NodeMailerHelper,
  ) {}

  @Post('login')
  @UsePipes(new CustomValidationPipe(authLoginValidation))
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<IResponse<{ token: string; role?: string }>> {
    try {
      const { username, password } = authLoginDto;
      const user = await this.adminService.findAdminByUserNameOrEmail(username);
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const isCorrectPassword = await this.passwordHelper.comparePassword(
        password,
        user.password,
      );
      if (!isCorrectPassword) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      const token = await this.authService.generateJwtToken<{
        id: string;
      }>({
        id: user.id,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Admin logged in successfully',
        data: {
          token,
          role: user.role,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('forgot-password')
  @UsePipes(new CustomValidationPipe(passwordForgotValidation))
  async forgotPassword(
    @Body() passwordForgotDto: PasswordForgotDto,
  ): Promise<IResponse<{ message: string }>> {
    try {
      const { email } = passwordForgotDto;
      const user = await this.adminService.findByEmail(email);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const token = await this.authService.generateJwtToken<{ id: string }>({
        id: user.id,
      });
      const clientUrl = process.env.CLIENT_URL;
      const resetPasswordLink = `${process.env.CLIENT_URL}/${links.resetPassword}?token=${token}`;
      const subject = 'Reset Password';
      const html = render(
        MepResetPasswordEmail({
          resetPasswordLink: resetPasswordLink,
          username: user.username,
          clientUrl,
        }),
      );
      try {
        await this.nodeMailerHelper.sendEmail(email, subject, html);
      } catch (error) {
        throw new HttpException(
          'Email delivery has failed, please check again your email address or try again later',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Reset password link sent to your email',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('reset-password/:token')
  @UsePipes(new CustomValidationPipe(passwordResetValidation))
  async resetPassword(
    @Param('token') token: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<IResponse<AdminDocument>> {
    try {
      const { pwd, confirmPwd } = updatePasswordDto;
      if (pwd !== confirmPwd) {
        throw new HttpException(
          'Passwords do not match',
          HttpStatus.BAD_REQUEST,
        );
      }
      const payload = await this.authService.decodeJwtToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
      }
      const user = await this.adminService.findById(payload.id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const hashedPassword = await this.passwordHelper.hashPassword(pwd);
      const updatedPwd = await this.adminService.update(user.id, {
        password: hashedPassword,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Password reset successfully',
        data: updatedPwd,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('change-password/:id')
  @UsePipes(new CustomValidationPipe(passwordChangeValidation))
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<IResponse<AdminDocument>> {
    try {
      const { oldPwd, newPwd } = changePasswordDto;

      const user = await this.adminService.findById(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const isCorrectPassword = await this.passwordHelper.comparePassword(
        oldPwd,
        user.password,
      );
      if (!isCorrectPassword) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }
      const hashedPassword = await this.passwordHelper.hashPassword(newPwd);
      const changedPwd = await this.adminService.update(user.id, {
        password: hashedPassword,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Password updated successfully',
        data: changedPwd,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
