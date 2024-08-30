import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument } from 'mongoose';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

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

const activitySchema = SchemaFactory.createForClass(Activity);

// Register pre delete hooks to do some related cloudinary cleanup
async function preDelFunc () {
  // This will delete the removed activities images from cloudinary
  const deletedActivities: ActivityDocument[] = await this.model.find(
    this.getFilter() as FilterQuery<ActivityDocument>
  )
  const deletedImages = deletedActivities.flatMap((doc) => doc.image);
  console.log(await Promise.all(deletedImages.map(async (url) => new CloudinaryService().removeImage(url))))
}
activitySchema.pre('deleteOne', preDelFunc);
activitySchema.pre('deleteMany', preDelFunc);


export { activitySchema };

