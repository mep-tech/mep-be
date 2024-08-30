import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, activitySchema } from './schemas/activity.schema';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: activitySchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService]
})
export class ActivityModule {}
