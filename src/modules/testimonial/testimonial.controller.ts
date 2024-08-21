import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
  UsePipes,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserAuthGuard } from '../auth/guards/auth.guard';
import { IResponse } from 'src/common/interface/response.interface';
import { TestimonialDocument } from './schema/testimonial.schema';
import { multerOptions } from 'src/common/helpers/multer.helper';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { createTestimonialValidation } from './validations/testimonial.validation';
import { CustomValidationPipe } from 'src/common/pipes/validation.pipe';

@Controller('testimonial')
export class TestimonialController {
  constructor(
    private readonly testimonialService: TestimonialService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(UserAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @UsePipes(new CustomValidationPipe(createTestimonialValidation))
  async create(
    @Body() createTestimonialDto: CreateTestimonialDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<IResponse<TestimonialDocument>> {
    try {
      const file =
        image &&
        (await this.cloudinaryService.uploadImage(image).catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }));
      const testimonial = await this.testimonialService.create({
        ...createTestimonialDto,
        image: file?.secure_url,
      });
      return {
        statusCode: 201,
        message: 'Testimonial added successfully',
        data: testimonial,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(): Promise<IResponse<TestimonialDocument[]>> {
    try {
      const testimonials = await this.testimonialService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Testimonials retrieved successfully',
        data: testimonials,
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
  ): Promise<IResponse<TestimonialDocument>> {
    try {
      const testimonial = await this.testimonialService.findOne(id);
      if (!testimonial) {
        throw new HttpException('Testimonial not found', HttpStatus.NOT_FOUND);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Testimonial retrieved successfully',
        data: testimonial,
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
    @Body() updateTestimonialDto: UpdateTestimonialDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<IResponse<TestimonialDocument>> {
    try {
      const testimonial = await this.testimonialService.findOne(id);
      if (!testimonial) {
        throw new HttpException('Testimonial not found', HttpStatus.NOT_FOUND);
      }
      const file =
        image &&
        (await this.cloudinaryService.uploadImage(image).catch((err) => {
          throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }));
      const newTestimonial = await this.testimonialService.update(id, {
        ...updateTestimonialDto,
        image: image && file?.secure_url,
      });
      if (image && testimonial.image)
        await this.cloudinaryService
          .removeImage(testimonial.image)
          .catch((err) => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
          });
      return {
        statusCode: HttpStatus.OK,
        message: 'Testimonial updated successfully',
        data: newTestimonial,
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
      const testimonial = await this.testimonialService.findOne(id);
      if (!testimonial) {
        throw new HttpException('Testimonial not found', HttpStatus.NOT_FOUND);
      }
      if (testimonial.image)
        await this.cloudinaryService
          .removeImage(testimonial.image)
          .catch((err) => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
          });
      const deletedTestimonial = await this.testimonialService.remove(id);
      if (!deletedTestimonial) {
        throw new HttpException(
          'Failed to delete testimonial',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Testimonial deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
