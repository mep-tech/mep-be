import { forwardRef, Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Testimonial, testimonialSchema } from './schema/testimonial.schema';
import { AuthModule } from '../auth/auth.module';
import { AdminModule } from '../admin/admin.module';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Testimonial.name, schema: testimonialSchema },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => AdminModule),
    forwardRef(() => CloudinaryModule),
  ],
  controllers: [TestimonialController],
  providers: [TestimonialService],
})
export class TestimonialModule {}
