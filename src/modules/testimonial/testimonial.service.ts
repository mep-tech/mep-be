import { Injectable } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { Testimonial, TestimonialDocument } from './schema/testimonial.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
  ) {}

  async create(
    createTestimonialDto: CreateTestimonialDto,
  ): Promise<TestimonialDocument> {
    return await this.testimonialModel.create(createTestimonialDto);
  }

  async findAll(): Promise<TestimonialDocument[]> {
    return await this.testimonialModel.find();
  }

  async findOne(id: string): Promise<TestimonialDocument> {
    return await this.testimonialModel.findById(id);
  }

  async update(
    id: string,
    updateTestimonialDto: UpdateTestimonialDto,
  ): Promise<TestimonialDocument> {
    return await this.testimonialModel.findByIdAndUpdate(
      id,
      updateTestimonialDto,
      { new: true },
    );
  }

  async remove(id: string): Promise<TestimonialDocument> {
    return await this.testimonialModel.findByIdAndDelete(id);
  }
}
