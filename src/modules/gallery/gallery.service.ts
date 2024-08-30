import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  Model,
  mongo,
  QueryOptions,
  UpdateWriteOpResult,
} from 'mongoose';
import { IImage } from 'src/common/interface/image.interface';
import {
  ProjectImage,
  ProjectImageDocument,
} from './schemas/Projectimage.schema';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(ProjectImage.name)
    private readonly projectImageModel: Model<ProjectImageDocument>,
  ) {}

  create({
    url,
    size = 0,
    mimetype = 'image/png',
  }: {
    name: string;
    url: string;
    size: number;
    mimetype: string;
  }): Promise<ProjectImageDocument> {
    return this.projectImageModel.create({ url, size, mimetype });
  }

  createMany(images: IImage[]): Promise<ProjectImageDocument[]> {
    return this.projectImageModel.insertMany(images);
  }

  findAll(
    query: FilterQuery<ProjectImageDocument> = {},
    options: QueryOptions = null,
  ): Promise<ProjectImageDocument[]> {
    return this.projectImageModel
      .find(query, null, options)
      .sort({ createdAt: 'desc' })
      .exec();
  }

  findOne(id: string): Promise<ProjectImageDocument> {
    return this.projectImageModel.findById(id).exec();
  }

  update(id: string, name: string): Promise<UpdateWriteOpResult> {
    return this.projectImageModel.updateOne({ _id: id }, { name }).exec();
  }

  remove(id: string): Promise<mongo.DeleteResult> {
    return this.projectImageModel.deleteOne({ _id: id }).exec();
  }
}
