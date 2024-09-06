import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { FilterQuery, HydratedDocument } from 'mongoose';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { Activity } from 'src/modules/activity/schemas/activity.schema';
import { ProjectImage } from 'src/modules/gallery/schemas/Projectimage.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
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
    unique: false,
    type: String,
  })
  public image: string;

  @Prop({
    trim: true,
    required: true,
    type: String,
  })
  public projectOwner: string;

  @Prop({
    trim: true,
    required: false,
    type: String,
  })
  public projectOwnerContact: string;

  @Prop({
    required: true,
    type: Date,
  })
  public startDate: Date;

  @Prop({
    type: Date,
  })
  public endDate: Date;

  @Prop({
    required: true,
    trim: true,
    type: String,
  })
  public location: string;

  @Prop({
    required: true,
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  })
  public activities: Activity[];

  @Prop({
    required: true,
    default: [],
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectImage' }],
  })
  public gallery: ProjectImage[];
}

const projectSchema = SchemaFactory.createForClass(Project);

// Register pre delete hooks to do some related schema cleanup
async function preDelFunc () {
  // This will delete the project gallery with will consequently delete its images from cloudinary also
  const cloudinaryService = new CloudinaryService();
  const projectImageModel = this.model.db.models[ProjectImage.name];
  const deletedProjects: ProjectDocument[] = await this.model.find(this.getFilter() as FilterQuery<ProjectDocument>)
  // Clean up the default project image from cloudinary
  await Promise.all(deletedProjects.map(async (doc) => {
    await cloudinaryService.removeImage(doc.image);
  }));
  // Clean up the project gallery images
  const deletedGallery = deletedProjects.flatMap((doc) => doc.gallery);
  await projectImageModel.deleteMany({ _id: { $in: deletedGallery } }).exec();
}
projectSchema.pre('deleteOne', preDelFunc);
projectSchema.pre('deleteMany', preDelFunc);

export { projectSchema };

