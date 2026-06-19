import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/TcpLogging.interceptor';
import { Request } from '@common/interfaces/tcp/common/request.interface';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { ProcessId } from '@common/decorator/lib/processId.decorator';
import { RequestParams } from '@common/decorator/lib/request.decorator';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getHello('hehASDADASDASDADe');
  }

  @MessagePattern('get_invoice')
  getInvoice(
    @ProcessId() processId: string,
    @RequestParams() params: { invoiceId: number; invoiceName: string }, // producer truyền cái nào, cái đó sẽ được lấy ở trong nnày.
  ): Response<string> {
    return Response.success(`hello bro ${params.invoiceId + params.invoiceName}`);
  }
}
