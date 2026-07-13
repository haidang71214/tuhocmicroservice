import { HTTP_MESSAGE } from '@common/constant/enum/http-message.enum';
import { HttpStatus } from '@nestjs/common';

export class ResponseGrpc<T> {
  code = HTTP_MESSAGE.OK;
  data?: T;
  error = '';
  statusCode?: number;
  constructor(data: Partial<ResponseGrpc<T>>) {
    this.code = data.code || HTTP_MESSAGE.OK;
    this.data = data.data;
    this.error = data.error || '';
    this.statusCode = data.statusCode;
  }

  static success<T>(Data?: T) {
    return new ResponseGrpc<T>({
      code: HTTP_MESSAGE.OK,
      error: '',
      data: Data,
      statusCode: HttpStatus.OK,
    });
  }
}
export type ResponseGrpcType<T> = ResponseGrpc<T>;
