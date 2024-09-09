import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  public names: string;

  @Prop({
    trim: true,
    required: false,
    type: String,
  })
  public message: string;

  @Prop({
    trim: true,
    required: false,
    type: String,
  })
  public company: string;

  @Prop({
    trim: true,
    required: false,
    type: String,
  })
  public role: string; // role at the company

  @Prop({
    required: false,
    sparse: true,
    trim: true,
    type: String,
  })
  public image: string;

  @Prop({
    required: false,
    type: String,
  })
  public companyLogo: string;

  @Prop({
    required: false,
    type: String,
  })
  public siteImage: string;
}

export const testimonialSchema = SchemaFactory.createForClass(Testimonial);
