import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as Joi from 'joi';
import mongoose from 'mongoose';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.Schema) {}

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

@Injectable()
export class ParamObjectIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'param') {
      try {
        new mongoose.Types.ObjectId(value as string);
      } catch {
        throw new HttpException(
          `Invalid Object ID. Provided ID: ${value}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return value;
  }
}
