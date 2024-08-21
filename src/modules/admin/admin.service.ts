import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
  ) {}

  async findAdminByUserNameOrEmail(
    usernameOrEmail: string,
  ): Promise<AdminDocument | null> {
    return await this.adminModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  async findAdminById(id: string): Promise<AdminDocument | null> {
    return await this.adminModel.findById(id);
  }

  async createMany(data: any[]): Promise<any[]> {
    return await this.adminModel.insertMany(data);
  }

  async deleteMany(): Promise<boolean | any> {
    return await this.adminModel.deleteMany();
  }
}
