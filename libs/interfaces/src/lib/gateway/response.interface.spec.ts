import { ResponseDto } from './response.interface';
import { HttpStatus } from '@nestjs/common';
import { HTTP_MESSAGE } from '@common/constant';

describe('ResponseDto', () => {
  it('should construct with default message and status code', () => {
    const dto = new ResponseDto({});
    expect(dto.statusCode).toBe(HttpStatus.OK);
  });

  it('should override fields with input data', () => {
    const dto = new ResponseDto({
      statusCode: HttpStatus.BAD_REQUEST,
      message: HTTP_MESSAGE.FAILED,
    });
    expect(dto.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(dto.message).toBe(HTTP_MESSAGE.FAILED);
  });
});
