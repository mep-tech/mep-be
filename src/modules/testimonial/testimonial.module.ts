import { forwardRef, Module } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Testimonial, testimonialSchema } from './schema/testimonial.schema';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Testimonial.name, schema: testimonialSchema },
    ]),
    forwardRef(() => CloudinaryModule),
  ],
  controllers: [TestimonialController],
  providers: [TestimonialService],
})
export class TestimonialModule {}
