import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  public names: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    trim: true,
    type: String,
  })
  public username: string; // can update ✅

  @Prop({
    index: true,
    trim: true,
    unique: true,
    type: String,
  })
  public email: string; // can update ❌, For forgot password reset

  @Prop({
    trim: true,
    type: String,
  })
  public password: string; // can update ✅

  @Prop({
    trim: true,
    default: 'admin',
    enum: ['admin', 'user'],
    type: String,
  })
  public role: string;

  @Prop({
    required: false,
    sparse: true,
    trim: true,
    type: String,
  })
  public avatar: string;
}

export const adminSchema = SchemaFactory.createForClass(Admin);
