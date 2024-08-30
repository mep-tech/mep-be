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
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { multerOptions } from 'src/common/helpers/multer.helper';
import { ArrayInterceptor } from 'src/common/interceptors/array.interceptor';
import { PaginationInterceptor } from 'src/common/interceptors/pagination.interceptor';
import { IResponse } from 'src/common/interface/response.interface';
import { CustomValidationPipe, ParamObjectIdValidationPipe } from 'src/common/pipes/validation.pipe';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { updateProjectActivitiesDto } from './dto/update-project-activities.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';
import { ProjectDocument } from './schemas/project.schema';
import { createProjectValidation } from './validations/createProject.validation';
import { updateProjectValidation } from './validations/updateProject.validation';
import { updateProjectActivitiesValidation } from './validations/updateProjectActivities.validation';
import { ActivityService } from '../activity/activity.service';
import { updateProjectGalleryDto } from './dto/update-project-gallery.dto';
import { updateProjectGalleryValidation } from './validations/updateProjectGallery.validation';
import { GalleryService } from '../gallery/gallery.service';
import { ProjectImageDocument } from '../gallery/schemas/Projectimage.schema';
import { ActivityDocument } from '../activity/schemas/activity.schema';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly activityService: ActivityService,
    private readonly galleryService: GalleryService
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @AuthGuard()
  @UseInterceptors(new ArrayInterceptor(['activities']))
  @UseInterceptors(FilesInterceptor('gallery', undefined, multerOptions))
  @UsePipes(new CustomValidationPipe(createProjectValidation))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles() gallery: Express.Multer.File[],
  ): Promise<IResponse<ProjectDocument>> {
    const {
      name,
      projectOwner,
      projectOwnerContact,
      startDate,
      endDate,
      location,
      activities = [],
    } = createProjectDto;

    const conflictProject = (await this.projectService.findAll({ name }))[0]
    if (conflictProject) {
      throw new HttpException(`Project with name '${name}' already exists`, HttpStatus.CONFLICT);
    }

    const uploadedGallery = await Promise.all(
      gallery.map(async (multerFile) => {
        const file = await this.cloudinaryService
          .uploadImage(multerFile, 'project-gallery')
          .catch((err) => {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
          });
        return {
          size: multerFile.size,
          url: file.secure_url,
          mimetype: multerFile.mimetype,
        };
      }),
    );

    const project = await (await this.projectService.create(
      {
        name,
        projectOwner,
        projectOwnerContact,
        startDate,
        endDate,
        location,
      },
      activities.map((activity) => ({
        _id: new mongoose.Types.ObjectId(activity),
      })),
      uploadedGallery,
    )).populate(['activities', 'gallery']);

    return {
      statusCode: HttpStatus.OK,
      message: 'Project created successfully',
      data: project,
    };
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  async findAll(
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationDto
  ): Promise<IResponse<ProjectDocument[]>> {
    const data = await this.projectService.findAll(null, pagination);
    return {
      statusCode: HttpStatus.OK,
      message: 'Projects fetched successfully',
      data,
    };
  }

  @Get(':id')
  @UsePipes(ParamObjectIdValidationPipe)
  async findOne(@Param('id') id: string): Promise<IResponse<ProjectDocument>> {
    const project = await this.projectService.findOne(id);
    if (!project) {
      throw new HttpException(`Project with id '${id}' not found`, HttpStatus.NOT_FOUND);
    }

    const data = await (await this.projectService.findOne(id)).populate(['activities']);
    return {
      statusCode: HttpStatus.OK,
      message: 'Project fetched successfully',
      data,
    };
  }

  @Patch(':id')
  @AuthGuard()
  @UsePipes(ParamObjectIdValidationPipe)
  @UsePipes(new CustomValidationPipe(updateProjectValidation))
  async update(@Param('id') id: string, @Body() body: UpdateProjectDto): Promise<IResponse<ProjectDocument>> {
    const { name } = body;

    const project = await this.projectService.findOne(id);
    if (!project) {
      throw new HttpException(`Project with id '${id}' not found`, HttpStatus.NOT_FOUND);
    }
    const conflictProject = (await this.projectService.findAll({ $and: [{ name }, {name: { $ne: project.name }}]}))[0]
    if (conflictProject && conflictProject._id.toString() !== id) {
      throw new HttpException(`Project with name '${name}' already exists`, HttpStatus.CONFLICT);
    }

    await this.projectService.update(id, body)
    return {
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
      data: await this.projectService.findOne(id),
    }
  }

  @Delete(':id')
  @AuthGuard()
  @UsePipes(ParamObjectIdValidationPipe)
  async remove(@Param('id') id: string): Promise<IResponse> {
    const project = await this.projectService.findOne(id);
    if (!project) {
      throw new HttpException(`Project with id '${id}' not found`, HttpStatus.NOT_FOUND);
    }

    const deletions = await this.projectService.remove(id)
    return {
      statusCode: HttpStatus.OK,
      message: `Deleted ${deletions.deletedCount} project${deletions.deletedCount !== 1 ? 's' : ''} successfully`,
    };
  }

  /* Activities related routes */
  @Get(':id/activities')
  @UsePipes(ParamObjectIdValidationPipe)
  @UseInterceptors(PaginationInterceptor)
  async fetchProjectActivities(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationDto
  ): Promise<IResponse<ActivityDocument[]>> {
    const project = await this.projectService.findOne(id);
    if (!project) {
      throw new HttpException(`Project with id '${id}' not found`, HttpStatus.NOT_FOUND);
    }

    const data = await this.activityService.findAll({ _id: { $in: project.activities }}, pagination)
    return {
      statusCode: HttpStatus.OK,
      message: 'Project activities fetched successfully',
      data,
    };
  }

  @Put(':id/activities')
  @AuthGuard()
  @UsePipes(ParamObjectIdValidationPipe, new CustomValidationPipe(updateProjectActivitiesValidation))
  async updateProjectActivities(@Param('id') id: string, @Body() body: updateProjectActivitiesDto): Promise<IResponse<ProjectDocument>> {
    const { activities } = body;

    const project = await this.projectService.findOne(id);
    if (!project) {
      throw new HttpException(`Project with id '${id}' not found`, HttpStatus.NOT_FOUND);
    }

    console.log("activities", activities)
    const fetchedActivities = await this.activityService.findAll({ _id: { $in: activities }})
    if (fetchedActivities.length < activities.length) {
      const notFoundActivities = [...activities]
      console.log("notFoundActivities", notFoundActivities)
      fetchedActivities.forEach((activity) => {
        const foundActivityIndex = notFoundActivities.findIndex((value) => value === activity._id.toString())
        console.log("foundActivityIndex", foundActivityIndex)
        notFoundActivities.splice(foundActivityIndex, 1)
      })
      if (notFoundActivities.length > 0) {
        throw new HttpException(`Activities with this ids: [${notFoundActivities.join(', ')}] not found`, HttpStatus.NOT_FOUND)
      }
    }

    await this.projectService.update(id, { activities })
    return {
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
      data: await this.projectService.findOne(id),
    }
  }

  /* Gallery related routes */
  @Get(':id/gallery')
  @UsePipes(ParamObjectIdValidationPipe)
  @UseInterceptors(PaginationInterceptor)
  async fetchProjectGallery(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true })) pagination: PaginationDto
  ): Promise<IResponse<ProjectImageDocument[]>> {
    const project = await this.projectService.findOne(id);
    if (!project) {
      throw new HttpException(`Project with id '${id}' not found`, HttpStatus.NOT_FOUND);
    }

    const data = await this.galleryService.findAll({ _id: { $in: project.gallery }}, pagination)
    return {
      statusCode: HttpStatus.OK,
      message: 'Project gallery fetched successfully',
      data,
    };
  }

  @Put(':id/gallery')
  @AuthGuard()
  @UsePipes(ParamObjectIdValidationPipe, new CustomValidationPipe(updateProjectGalleryValidation))
  async updateProjectGallery(@Param('id') id: string, @Body() body: updateProjectGalleryDto): Promise<IResponse<ProjectDocument>> {
    const { gallery } = body;

    const project = await this.projectService.findOne(id);
    if (!project) {
      throw new HttpException(`Project with id '${id}' not found`, HttpStatus.NOT_FOUND);
    }

    /* Check if provided gallery images ids exists */
    const fetchedGallery = await this.galleryService.findAll({ _id: { $in: gallery }})
    if (fetchedGallery.length < gallery.length) {
      const notFoundGallery = [...gallery]
      fetchedGallery.forEach((GalleryImage) => {
        const foundActivityIndex = notFoundGallery.findIndex((value) => value === GalleryImage._id.toString())
        notFoundGallery.splice(foundActivityIndex, 1)
      })
      if (notFoundGallery.length > 0) {
        throw new HttpException(`Gallery images with this ids: [${notFoundGallery.join(', ')}] not found`, HttpStatus.NOT_FOUND)
      }
    }

    await this.projectService.update(id, { gallery })
    return {
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
      data: await this.projectService.findOne(id),
    }
  }
}
