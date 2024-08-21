import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
  ArgumentMetadata,
} from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      const { error } = this.schema.validate(value);

      if (error) {
        throw new HttpException(
          error.details[0].message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return value;
  }
}
