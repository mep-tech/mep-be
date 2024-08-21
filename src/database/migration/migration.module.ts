import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { MongooseConfigModule } from '../mongoose.module';
import { PasswordHelper } from 'src/common/helpers/password.helper';
import { AdminSeed } from './seeds/admin.seed';
import { AdminModule } from 'src/modules/admin/admin.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CommandModule, AdminModule, MongooseConfigModule, ConfigModule],
  providers: [AdminSeed, PasswordHelper],
})
export class MigrationModule {}
