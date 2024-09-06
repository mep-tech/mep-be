import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument } from 'mongoose';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

export type ProjectImageDocument = HydratedDocument<ProjectImage>;

@Schema({ timestamps: true })
export class ProjectImage {
  @Prop({
    required: true,
    trim: true,
    type: String,
    unique: true,
  })
  public url: string;

  @Prop({
    required: true,
    trim: true,
    type: Number,
    default: 0,
  })
  public size: number;

  @Prop({
    required: false,
    trim: true,
    type: String,
    default: 'image/png',
  })
  public mimetype: string;
}

const projectImageSchema = SchemaFactory.createForClass(ProjectImage);
projectImageSchema.virtual('project', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'gallery',
  justOne: false,
})

// Register pre delete hooks to do some related cloudinary cleanup
async function preDelFunc () {
  // This will delete the removed ProjectImages docs images from cloudinary
  const deletedProjectImages: ProjectImageDocument[] = await this.model.find(
    this.getFilter() as FilterQuery<ProjectImageDocument>
  )
  const deletedImages = deletedProjectImages.flatMap((doc) => doc.url);
  await Promise.all(deletedImages.map(async (url) => new CloudinaryService().removeImage(url)))
  // Remove the project images from the project gallery
  const deletedProjectImagesIds = deletedProjectImages.map((doc) => doc._id);
  const projectModel = this.model.db.models['Project'];
  await projectModel.updateMany(
    { gallery: { $in: deletedProjectImagesIds } },
    { $pull: { gallery: { $in: deletedProjectImagesIds } } }
  ).exec();
}
projectImageSchema.pre('deleteOne', preDelFunc);
projectImageSchema.pre('deleteMany', preDelFunc);

export { projectImageSchema }
