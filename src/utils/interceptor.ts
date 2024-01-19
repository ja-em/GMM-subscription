import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';

export class GlobalInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      map((data) => ({ data })),
      catchError((e) => {
        if (e.status) {
          return throwError(() => e);
        }
        if (Array.isArray(e)) {
          return throwError(() => new BadRequestException(e));
        }
        if (e.message) {
          return throwError(() => new InternalServerErrorException(e.message));
        }
        Logger.error(e, GlobalInterceptor.name);
        return throwError(() => new InternalServerErrorException(e));
      }),
    );
  }
}
