import { CallHandler, ExecutionContext, NestInterceptor, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { map, catchError, Observable } from 'rxjs';
import { Request } from 'express';
import { MetadataKeys } from '@common/constant';
import { HTTP_MESSAGE } from '@common/constant';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';

export class ExceptionInterceptor implements NestInterceptor {
  // Khởi tạo logger của NestJS để ghi nhận lỗi hệ thống ra console/file
  private readonly logger = new Logger(ExceptionInterceptor.name);
  /**
   * Hàm interceptor dùng để can thiệp và xử lý luồng Request - Response
   * @param context ExecutionContext: Hồ sơ ngữ cảnh, chứa thông tin chi tiết về request hiện tại (như giao thức kết nối, Controller và Method đang xử lý...)
   * @param next CallHandler: Đối tượng điều khiển luồng, gọi next.handle() để cho phép request đi tiếp vào Controller và nhận lại luồng dữ liệu trả về (Observable)
   */
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // BƯỚC 1: Chuyển đổi ngữ cảnh thực thi sang HTTP để lấy được đối tượng Request của Express
    const ctx = context.switchToHttp();
    // CÚ PHÁP: Sử dụng Intersection Type (&) để khai báo request có các key động trong MetadataKeys
    const request: Request & { [MetadataKeys.PROCESS_ID]: string; [MetadataKeys.START_TIME]: number } =
      ctx.getRequest();
    // BƯỚC 2: Lấy ra mã log tiến trình (processID) và mốc thời gian bắt đầu (startTime) đã được gán bởi Middleware trước đó
    const processID = request[MetadataKeys.PROCESS_ID];
    const startTime = request[MetadataKeys.START_TIME];
    // BƯỚC 3: next.handle() chuyển request vào Controller. pipe() dùng để kết hợp các toán tử của RxJS xử lý luồng dữ liệu trả về
    return next.handle().pipe(
      // BƯỚC 4: map() dùng để biến đổi kết quả khi API chạy THÀNH CÔNG (Controller trả về kết quả)
      map((data: ResponseDto<unknown>) => {
        // Tính tổng thời gian xử lý của API bằng cách lấy mốc thời điểm hiện tại trừ đi mốc lúc bắt đầu
        const durationMs = Date.now() - startTime;
        // Gán mã tiến trình và thời gian xử lý vào Response DTO để trả về cho Client
        data.processId = processID;
        data.duration = `${durationMs} ms`;
        return data;
      }),
      // BƯỚC 5: catchError() dùng để đánh chặn và xử lý khi API bị THẤT BẠI (xảy ra lỗi/ném Exception trong Controller/Service)
      catchError((error) => {
        this.logger.error({ error });

        const durationMs = Date.now() - startTime;

        const message = error?.response?.message || error?.message || error || HTTP_MESSAGE.INTERNAL_SERVER_ERROR;
        const code =
          error?.code || error?.statusCode || error?.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

        // Đảm bảo status truyền vào HttpException là số (number) để tránh crash Express/NestJS
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
