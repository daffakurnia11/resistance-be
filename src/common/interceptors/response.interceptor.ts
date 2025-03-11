import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
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
        const code: HttpStatus = response.statusCode;

        if (data.statusCode) {
          return {
            code: data.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            success: data.success || false,
            message: data.message || 'Internal Server Error',
            data: data.data,
          };
        }
        return {
          code,
          success: true,
          message:
            code === HttpStatus.OK
              ? 'OK'
              : code === HttpStatus.CREATED
                ? 'Created'
                : code === HttpStatus.NO_CONTENT
                  ? 'No Content'
                  : '',
          data: data || null,
        };
      }),
    );
  }
}
