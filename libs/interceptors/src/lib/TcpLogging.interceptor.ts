import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, HttpStatus } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { HTTP_MESSAGE } from '@common/constant';

/**
 * Decorator @Injectable() thông báo cho NestJS biết class này là một Provider.
 * Nó có thể được quản lý bởi NestJS IoC Container và tự động tiêm (inject) vào các Controller hoặc Service khác khi cần.
 */
@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
  /**
   * Hàm intercept() bắt buộc phải có khi implement interface NestInterceptor.
   * Hàm này đóng vai trò là "người gác cổng" chặn bắt request trước và sau khi đi vào Controller.
   *
   * @param context ExecutionContext: Chứa toàn bộ thông tin về phiên thực thi hiện tại (Metadata, giao thức kết nối, class controller và method xử lý).
   * @param next CallHandler: Cung cấp hàm handle() dùng để kích hoạt chuyển tiếp request đến bước tiếp theo (Controller).
   * @returns Trả về một Observable hoặc Promise Observable chứa kết quả xử lý.
   */
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    // 1. Ghi lại mốc thời gian bắt đầu nhận request (dưới dạng miliseconds)
    const now = Date.now();

    // 2. Trích xuất thông tin hàm xử lý trong Controller
    const handler = context.getHandler(); // Lấy hàm đang được map với RequestPattern (ví dụ: createInvoice)
    const handlerName = handler.name; // Lấy tên hàm dưới dạng chuỗi (string) để in log

    // 3. Trích xuất các tham số truyền từ client sang Microservice
    const args = context.getArgs(); // Với giao thức TCP, args là một mảng chứa dữ liệu payload
    const param = args[0]; // Lấy phần tử đầu tiên (chính là payload data gửi từ BFF sang)
    const processId = param.processId; // Lấy mã định danh tiến trình (Process ID / Correlation ID) để theo vết log

    // 4. GHI LOG BẮT ĐẦU (Chạy TRƯỚC KHI request đi vào Controller)
    // Log ra: ID tiến trình, tên hàm xử lý, thời gian bắt đầu, và dữ liệu đầu vào (parameters) dưới dạng chuỗi JSON
    Logger.log(
      `TCP >> Start process '${processId}' >> method: '${handlerName}' at '${now}' >> param: ${JSON.stringify(param)}`,
    );

    // 5. Giao quyền xử lý cho Controller và bắt đầu can thiệp luồng kết quả trả về
    return next.handle().pipe(
      // TOÁN TỬ TAP (RxJS): Chạy khi Controller xử lý THÀNH CÔNG và không gặp bất kỳ lỗi nào.
      // Dùng để ghi log hoàn thành kèm theo thời gian xử lý thực tế (Tổng thời gian = Thời điểm kết thúc - Thời điểm bắt đầu)
      tap(() =>
        Logger.log(`TCP >> End process '${processId}' >> method: '${handlerName}' after: '${Date.now() - now}ms'`),
      ),

      // TOÁN TỬ CATCHERROR (RxJS): Chạy khi Controller gặp LỖI trong quá trình xử lý.
      catchError((error) => {
        // A. Tính toán thời gian chạy cho đến khi phát sinh lỗi
        const duration = Date.now() - now;
        // B. Ghi nhận chi tiết lỗi ra màn hình console (chữ màu đỏ của Logger.error)
        // Log bao gồm: ID tiến trình, tin nhắn lỗi (error.message), và thời gian chạy trước khi lỗi xảy ra
        Logger.error(`TCP >> Error process '${processId}' after '${duration}ms': ${error.message}`, error.stack);
        // C. Ném ra lỗi theo chuẩn RpcException của Microservice NestJS.
        // Điều này đảm bảo rằng lỗi sẽ được đóng gói chuẩn chỉnh và truyền an toàn qua cổng kết nối TCP về phía BFF.
        throw new RpcException({
          // Sử dụng toán tử OR (||) để lấy mã trạng thái (status/code) phù hợp. Nếu không có, mặc định là lỗi 500 (INTERNAL_SERVER_ERROR)
          code: error.status || error.code || error.error?.code || HttpStatus.INTERNAL_SERVER_ERROR,

          // Truyền statusCode về BFF để ánh xạ đúng mã lỗi HTTP (ví dụ: 400 Bad Request)
          statusCode: error.statusCode || error.error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,

          // Sử dụng Optional Chaining (?.) và toán tử OR (||) để trích xuất tin nhắn lỗi. Nếu không có, mặc định là thông báo lỗi hệ thống
          message:
            error?.response?.message || error?.message || error.error?.message || HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
        });
      }),
    );
  }
}
