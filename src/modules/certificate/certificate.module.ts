import { forwardRef, Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Certificate, certificateSchema } from './schema/certificate.schema';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: certificateSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => AdminModule),
    forwardRef(() => CloudinaryModule),
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
