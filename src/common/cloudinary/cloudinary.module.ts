import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [CloudinaryProvider, CloudinaryService, ConfigService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
