import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandModule } from 'nestjs-command';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { AdminModule } from 'src/modules/admin/admin.module';
import { MongooseConfigModule } from '../mongoose.module';
import { ActivitySeed } from './seeds/activities.seed';
import { AdminSeed } from './seeds/admin.seed';

@Module({
  imports: [CommandModule, AdminModule, MongooseConfigModule, ConfigModule, ActivityModule, CloudinaryModule],
  providers: [AdminSeed, ActivitySeed, PasswordHelper],
})
export class MigrationModule {}
