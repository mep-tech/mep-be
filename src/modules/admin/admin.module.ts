import { forwardRef, Global, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, adminSchema } from './schema/admin.schema';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: adminSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => CloudinaryModule),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
