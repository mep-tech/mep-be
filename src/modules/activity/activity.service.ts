import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, mongo, QueryOptions, UpdateWriteOpResult } from 'mongoose';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity, ActivityDocument } from './schemas/activity.schema';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<ActivityDocument>,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
  ): Promise<ActivityDocument> {
    return this.activityModel.create(createActivityDto);
  }

  async createMany(
    createActivityDtos: CreateActivityDto[],
  ): Promise<ActivityDocument[]> {
    return this.activityModel.insertMany(createActivityDtos);
  }

  async findAll(
    query?: FilterQuery<ActivityDocument>,
    options?: QueryOptions
  ): Promise<ActivityDocument[]> {
    return this.activityModel.find(query, null, options).sort({ createdAt: 'desc' }).exec();
  }

  async findOne(id: string): Promise<ActivityDocument> {
    return this.activityModel.findById(id).exec();
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<UpdateWriteOpResult> {
    return this.activityModel.updateOne({ _id: id }, updateActivityDto).exec();
  }

  async remove(id: string): Promise<mongo.DeleteResult> {
    return this.activityModel.deleteOne({ _id: id }).exec();
  }

  async removeMany(ids: string[]): Promise<mongo.DeleteResult> {
    return this.activityModel.deleteMany({ _id: { $in: ids } }).exec();
  }
}
