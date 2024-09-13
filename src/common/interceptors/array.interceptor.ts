import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

export class ArrayInterceptor implements NestInterceptor {
  // This interceptor will convert a comma-separated string to an array of strings if the field is present in the fields array provided in the constructor.
  constructor(private fields: string[]) { }

  intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { body } = request;
    if (body) {
      Object.keys(body).forEach((key) => {
        if (this.fields.includes(key) && typeof body[key] === 'string') {
          body[key] = body[key].split(/ *, */g);
        }
      });
    }
    return next.handle();
  }
}
