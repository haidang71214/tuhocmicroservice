import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { firstValueFrom, map } from 'rxjs';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { ProcessId } from '@common/decorator/lib/processId.decorator';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient,
  ) {}

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDto({ data: result });
  }

  @Get('invoice')
  async getInvoice(@ProcessId() processId: string) {
    return this.invoiceClient
      .send<
        string,
        { invoiceId: number; invoiceName: string }
      >('get_invoice', { processId, data: { invoiceId: 12, invoiceName: 'asdasdas' } })
      .pipe(map((data) => new ResponseDto<string>(data)));
  }
}
