import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member {
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
  public phone: string;

  @Prop({
    trim: true,
    required: false,
    type: String,
  })
  public role: string;

  @Prop({
    trim: true,
    required: false,
    type: Number,
  })
  public order: number;

  @Prop({
    required: true,
    sparse: true,
    trim: true,
    type: String,
  })
  public image: string;
}

export const memberSchema = SchemaFactory.createForClass(Member);
