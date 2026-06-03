import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { UploadfileTcpRequest } from '@common/interfaces/tcp/media/media.request';
import { MediaService } from '../services/media.service';
import { TcpLoggingInterceptor } from '@common/interceptors/TcpLogging.interceptor';
import { RequestParams } from '@common/decorator/lib/request.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
  @MessagePattern(TCP_REQUEST_MESSAGE.Media.UPLOAD_FILE)
  async uploadFile(@RequestParams() data: UploadfileTcpRequest): Promise<Response<string>> {
    const fileUrl = await this.mediaService.uploadFile(data);
    return Response.success(fileUrl);
  }
}
