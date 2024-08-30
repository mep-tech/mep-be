import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import {
  ProjectImage,
  projectImageSchema,
} from './schemas/Projectimage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectImage.name, schema: projectImageSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService]
})
export class GalleryModule {}
