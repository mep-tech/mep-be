import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { query } = req;
    const { limit, skip } = query;
    if (limit) {
      query.limit = +limit;
    }
    if (skip) {
      query.skip = +skip;
    }
    return next.handle();
  }
}
