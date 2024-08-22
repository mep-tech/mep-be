import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  UseGuards,
  UseInterceptors,
  UsePipes,
  UploadedFile,
} from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { multerOptions } from 'src/common/helpers/multer.helper';
import { AdminGuard } from '../auth/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomValidationPipe } from 'src/common/pipes/validation.pipe';
import { UserAuthGuard } from '../auth/guards/auth.guard';
import { IResponse } from 'src/common/interface/response.interface';
import { CertificateDocument } from './schema/certificate.schema';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { createCertificateValidation } from './validations/certificate.validation';

@Controller('certificate')
export class CertificateController {
  constructor(
    private readonly certificateService: CertificateService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(UserAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @UsePipes(new CustomValidationPipe(createCertificateValidation))
  async create(
    @Body() createCertificateDto: CreateCertificateDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<IResponse<CertificateDocument>> {
    try {
      if (!image) {
        throw new HttpException('Image is required', HttpStatus.BAD_REQUEST);
      }
      const file =
        image &&
        (await this.cloudinaryService.uploadImage(image).catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }));
      const certificate = await this.certificateService.create({
        ...createCertificateDto,
        image: file?.secure_url,
      });

      return {
        statusCode: 201,
        message: 'Certificate added successfully',
        data: certificate,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<IResponse<CertificateDocument[]>> {
    try {
      const certificates = await this.certificateService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Certificates retrieved successfully',
        data: certificates,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<IResponse<CertificateDocument>> {
    try {
      const certificate = await this.certificateService.findOne(id);
      if (!certificate) {
        throw new HttpException('Certificate not found', HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Certificate retrieved successfully',
        data: certificate,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<IResponse<CertificateDocument>> {
    try {
      const certificate = await this.certificateService.findOne(id);
      if (!certificate) {
        throw new HttpException('Certificate not found', HttpStatus.NOT_FOUND);
      }
      const file =
        image &&
        (await this.cloudinaryService.uploadImage(image).catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }));
      const newCertificate = await this.certificateService.update(id, {
        ...updateCertificateDto,
        image: image && file?.secure_url,
      });
      if (image && certificate.image)
        await this.cloudinaryService
          .removeImage(certificate.image)
          .catch((err) => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
          });
      return {
        statusCode: HttpStatus.OK,
        message: 'Certificate updated successfully',
        data: newCertificate,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<IResponse<void>> {
    try {
      const certificate = await this.certificateService.findOne(id);
      if (!certificate) {
        throw new HttpException('Certificate not found', HttpStatus.NOT_FOUND);
      }
      if (certificate.image)
        await this.cloudinaryService
          .removeImage(certificate.image)
          .catch((err) => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
          });
      const deletedCertificate = await this.certificateService.remove(id);
      if (!deletedCertificate) {
        throw new HttpException(
          'Failed to delete certificate',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Certificate deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
