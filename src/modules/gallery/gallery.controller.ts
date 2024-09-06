import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { multerOptions } from 'src/common/helpers/multer.helper';
import { PaginationInterceptor } from 'src/common/interceptors/pagination.interceptor';
import { IResponse } from 'src/common/interface/response.interface';
import {
  ParamObjectIdValidationPipe
} from 'src/common/pipes/validation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { GalleryService } from './gallery.service';
import { ProjectImageDocument } from './schemas/Projectimage.schema';

export const projectImagesDirectory = 'project-images';

@ApiTags('Gallery')
@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post()
  @AuthGuard()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', null, multerOptions))
  async create (
    @Body() body: CreateGalleryDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<IResponse<ProjectImageDocument[]>> {

    const uploadedGallery = await Promise.all(
      images.map(async (image) => {
        const url = (await this.cloudinaryService.uploadImage(image, projectImagesDirectory))
          .secure_url;
        return {
          url,
          size: image.size,
          mimetype: image.mimetype,
        };
      }),
    );

    const data = await this.galleryService.createMany(uploadedGallery);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Gallery image created successfully',
      data,
    };
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  async findAll (
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationDto
  ): Promise<IResponse<ProjectImageDocument[]>> {
    const data = await this.galleryService.findAll({}, pagination);

    return {
      statusCode: HttpStatus.OK,
      message: 'Gallery images fetched successfully',
      data,
    };
  }

  @Get(':id')
  @UsePipes(ParamObjectIdValidationPipe)
  async findOne (
    @Param('id') id: string,
  ): Promise<IResponse<ProjectImageDocument>> {
    return {
      statusCode: HttpStatus.OK,
      message: 'Gallery image fetched successfully',
      data: await this.galleryService.findOne(id),
    };
  }


  @Delete(':id')
  @AuthGuard()
  @UsePipes(ParamObjectIdValidationPipe)
  async remove (@Param('id') id: string): Promise<IResponse> {
    const projectImage = await this.galleryService.findOne(id);
    if (!projectImage) {
      throw new HttpException(
        `Gallery image with id '${id}' not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // await this.cloudinaryService.removeImage(projectImage.url);
    await this.galleryService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Gallery image deleted successfully',
    };
  }
}
