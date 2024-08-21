import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IResponse } from 'src/common/interface/response.interface';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from '../admin/admin.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    private readonly passwordHelper: PasswordHelper,
  ) {}

  @Post('login')
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
}
