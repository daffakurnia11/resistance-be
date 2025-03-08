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
      map((data: any) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        if (data.statusCode) {
          return {
            statusCode: data.statusCode || 500,
            success: data.success || false,
            message: data.message || 'Internal Server Error',
            data: data.data,
          };
        }
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
