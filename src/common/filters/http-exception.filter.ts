import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status: HttpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    response.status(status).json({
      code: status,
      success: false,
      message:
        status === HttpStatus.BAD_REQUEST
          ? 'Bad Request'
          : status === HttpStatus.NOT_FOUND
            ? 'Not Found'
            : status === HttpStatus.INTERNAL_SERVER_ERROR
              ? 'Internal Server Error'
              : 'Error',
      error: message,
    });
  }
}
