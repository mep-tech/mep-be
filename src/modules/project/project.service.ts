import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, mongo, QueryOptions, UpdateWriteOpResult } from 'mongoose';
import { ProjectImage, ProjectImageDocument } from '../gallery/schemas/Projectimage.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './schemas/project.schema';
import { PartialType } from '@nestjs/mapped-types';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(ProjectImage.name)
    private readonly projectImageModel: Model<ProjectImageDocument>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    activities: { _id: mongoose.Types.ObjectId }[],
    gallery: ProjectImage[],
  ): Promise<ProjectDocument> {
    gallery = await this.projectImageModel.insertMany(gallery);
    return await this.projectModel.create({
      ...createProjectDto,
      activities,
      gallery,
    });
  }

  findAll(query?: FilterQuery<ProjectDocument>, options?: QueryOptions): Promise<ProjectDocument[]> {
    return this.projectModel.find(query, null, options).exec();
  }

  findOne(id: string): Promise<ProjectDocument> {
    return this.projectModel.findById(id).exec()
  }

  update(id: string, data: Partial<CreateProjectDto>): Promise<UpdateWriteOpResult> {
    return this.projectModel.updateOne({ _id: id }, data).exec();
  }

  remove(id: string): Promise<mongo.DeleteResult> {
    return this.projectModel.deleteOne({ _id: id }).exec();
  }
}
