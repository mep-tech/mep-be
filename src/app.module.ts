import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MigrationModule } from './database/migration/migration.module';
import { MongooseConfigModule } from './database/mongoose.module';
import { ActivityModule } from './modules/activity/activity.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { MemberModule } from './modules/member/member.module';
import { ProjectModule } from './modules/project/project.module';
import { TestimonialModule } from './modules/testimonial/testimonial.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseConfigModule,
    TestimonialModule,
    MigrationModule,
    MemberModule,
    CertificateModule,
    ProjectModule,
    GalleryModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
