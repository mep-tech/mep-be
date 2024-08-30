import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { multerOptions } from 'src/common/helpers/multer.helper';
import { IResponse } from 'src/common/interface/response.interface';
import {
  CustomValidationPipe,
  ParamObjectIdValidationPipe,
} from 'src/common/pipes/validation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityDocument } from './schemas/activity.schema';
import { createActivityValidation } from './validations/createActivity.validation';
import { updateActivityValidation } from './validations/updateActivity.validation';

@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @AuthGuard()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @UsePipes(new CustomValidationPipe(createActivityValidation))
  async create(
    @Body() body: CreateActivityDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<IResponse<ActivityDocument>> {
    const { name } = body;

    const activity = (await this.activityService.findAll({ name }))[0];
    if (activity) {
      throw new HttpException(
        `Activity with name '${name}' already exists`,
        HttpStatus.CONFLICT,
      );
    }

    const uploadedFile = await this.cloudinaryService.uploadImage(
      image,
      'activities-image',
    );
    body.image = uploadedFile.secure_url;

    const data = await this.activityService.create(body);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Activities created successfully',
      data,
    };
  }

  @Get()
  findAll(): Promise<ActivityDocument[]> {
    return this.activityService.findAll();
  }

  @Get(':id')
  @UsePipes(ParamObjectIdValidationPipe)
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(id);
  }

  @Patch(':id')
  @AuthGuard()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @UsePipes(ParamObjectIdValidationPipe)
  @UsePipes(new CustomValidationPipe(updateActivityValidation))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateActivityDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<IResponse<ActivityDocument>> {
    const { name } = body || {};

    // Check if activity exists and name not already taken
    const activity = await this.activityService.findOne(id);
    if (!activity) {
      throw new HttpException(
        `Activity with id '${id}' doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (name) {
      const conflictActivity = (
        await this.activityService.findAll({ name })
      )[0];
      if (conflictActivity) {
        throw new HttpException(
          `Activity with name '${name}' already exists`,
          HttpStatus.CONFLICT,
        );
      }
    }

    if (image) {
      // Upload the activity image
      const uploadedFile = await this.cloudinaryService.uploadImage(
        image,
        'activities-image',
      );
      body.image = uploadedFile.secure_url;
      // Delete the old uploaded image
      await this.cloudinaryService.removeImage(activity.image);
    }

    await this.activityService.update(id, body);
    const data = await this.activityService.findOne(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'Activity updated successfully',
      data,
    };
  }

  @Delete(':id')
  @AuthGuard()
  @UsePipes(ParamObjectIdValidationPipe)
  async remove(@Param('id') id: string): Promise<IResponse> {
    const activity = await this.activityService.findOne(id);
    if (!activity) {
      throw new HttpException(
        `Activity with id '${id}' doesn't exists`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Delete activity's uploaded image
    await this.cloudinaryService.removeImage(activity.image);
    const resp = await this.activityService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: `Deleted ${resp.deletedCount} activity successfully`,
    };
  }
}
