import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema({ timestamps: true })
export class Certificate {
  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  public title: string;

  @Prop({
    required: false,
    trim: true,
    type: String,
  })
  public description: string;

  @Prop({
    required: true,
    sparse: true,
    trim: true,
    type: String,
  })
  public image: string;
}

export const certificateSchema = SchemaFactory.createForClass(Certificate);
