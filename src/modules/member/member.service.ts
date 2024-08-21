import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member, MemberDocument } from './schema/member.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<MemberDocument> {
    return await this.memberModel.create(createMemberDto);
  }

  async findAll(): Promise<MemberDocument[]> {
    return await this.memberModel.find().sort({ order: 1 });
  }

  async findOne(id: string): Promise<MemberDocument> {
    return await this.memberModel.findById(id);
  }

  async findOneByName(names: string): Promise<MemberDocument> {
    return await this.memberModel.findOne({ names });
  }

  async findLastMember(): Promise<MemberDocument> {
    return await this.memberModel.findOne().sort({ order: -1 });
  }

  async update(
    id: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<MemberDocument> {
    return await this.memberModel.findByIdAndUpdate(id, updateMemberDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<MemberDocument> {
    return await this.memberModel.findByIdAndDelete(id);
  }
}
