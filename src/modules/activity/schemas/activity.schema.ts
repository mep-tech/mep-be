import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema({ timestamps: true, validateBeforeSave: true })
export class Activity {
  @Prop({
    required: false,
    trim: true,
    type: String,
  })
  public alias?: string;

  @Prop({
    required: true,
    trim: true,
    unique: true,
    type: String,
  })
  public name: string;

  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  public image: string;
}

export const activitySchema = SchemaFactory.createForClass(Activity);
