import { CallHandler, ExecutionContext, NestInterceptor, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { map, catchError, Observable } from 'rxjs';
import { Request } from 'express';
import { MetadataKeys } from '@common/constant';
import { HTTP_MESSAGE } from '@common/constant';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';

export class ExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request: Request & { [MetadataKeys.PROCESS_ID]: string; [MetadataKeys.START_TIME]: number } =
      ctx.getRequest();
    const processID = request?.[MetadataKeys.PROCESS_ID] || 'unknown';
    const startTime = request?.[MetadataKeys.START_TIME] || Date.now();
    return next.handle().pipe(
      map((data: ResponseDto<unknown>) => {
        const durationMs = Date.now() - startTime;
        data.processId = processID;
        data.duration = `${durationMs} ms`;
        return data;
      }),
      catchError((error) => {
        this.logger.error({ error });

        const durationMs = Date.now() - startTime;

        const message = error?.response?.message || error?.message || error || HTTP_MESSAGE.INTERNAL_SERVER_ERROR;
        const code =
          error?.code || error?.statusCode || error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        const httpStatusCode =
          typeof code === 'number' && Number.isInteger(code) && code >= 100 && code < 600
            ? code
            : Number(error?.statusCode || error?.response?.statusCode) || HttpStatus.INTERNAL_SERVER_ERROR;

        throw new HttpException(
          new ResponseDto({
            data: null,
            message,
            statusCode: code,
            duration: `${durationMs} ms`,
            processId: processID,
          }),
          httpStatusCode,
        );
      }),
    );
  }
}
