import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: unknown) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        return {
          statusCode,
          success: statusCode >= 200 && statusCode < 300,
          message:
            statusCode === 200
              ? 'OK'
              : statusCode === 201
                ? 'Created'
                : statusCode === 204
                  ? 'No Content'
                  : '',
          data: data || null,
        };
      }),
    );
  }
}
