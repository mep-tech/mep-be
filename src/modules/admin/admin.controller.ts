import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UserAuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { IResponse } from 'src/common/interface/response.interface';
import { AdminDocument } from './schema/admin.schema';
import { multerOptions } from 'src/common/helpers/multer.helper';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get(':id')
  @UseGuards(UserAuthGuard, AdminGuard)
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<IResponse<AdminDocument>> {
    try {
      if (req['user']?.id !== id) {
        throw new HttpException(
          'Only account owner can perform this action',
          HttpStatus.FORBIDDEN,
        );
      }
      const admin = await this.adminService.findById(id);
      if (!admin) {
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Admin retrieved successfully',
        data: admin,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseGuards(UserAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<AdminDocument>,
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req: Request,
  ): Promise<IResponse<AdminDocument>> {
    try {
      if (req['user']?.id !== id) {
        throw new HttpException(
          'Only account owner can perform this action',
          HttpStatus.FORBIDDEN,
        );
      }
      const { names, username, email } = updateData;
      const existingAdmin = await this.adminService.findById(id);
      if (!existingAdmin) {
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
      }

      const file =
        avatar &&
        (await this.cloudinaryService.uploadImage(avatar).catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }));

      const updatedAdmin = await this.adminService.update(id, {
        names: names || existingAdmin.names,
        username: username || existingAdmin.username,
        email: email || existingAdmin.email,
        avatar: file?.secure_url || existingAdmin.avatar,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Admin updated successfully',
        data: updatedAdmin,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
