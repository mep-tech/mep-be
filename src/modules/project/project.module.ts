import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { ProjectImage, projectImageSchema } from '../gallery/schemas/Projectimage.schema';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project, projectSchema } from './schemas/project.schema';
import { ActivityModule } from '../activity/activity.module';
import { GalleryModule } from '../gallery/gallery.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectImage.name, schema: projectImageSchema },
      { name: Project.name, schema: projectSchema }
    ]),
    CloudinaryModule,
    ActivityModule,
    GalleryModule
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
