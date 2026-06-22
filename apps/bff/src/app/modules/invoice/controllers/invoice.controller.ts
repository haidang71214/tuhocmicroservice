import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { firstValueFrom, map } from 'rxjs';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { ProcessId } from '@common/decorator/lib/processId.decorator';
import { InvoiceService } from '../services/invoice.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvoiceResponseDto, InvoiceRequestDto } from '@common/interfaces/gateway/invoice';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { InvoiceTcpRequest, InvoiceTcpResponse } from '@common/interfaces/tcp/invoice';

@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'create invoice' })
  async createInvoice(@Body() data: InvoiceRequestDto, @ProcessId() processId: string) {
    return this.invoiceClient.send<InvoiceTcpResponse, InvoiceTcpRequest>(TCP_REQUEST_MESSAGE.Invoice.CREATE, {
      data,
      processId,
    });
  }

  @Get('')
  async getInvoice(@ProcessId() processId: string) {
    return this.invoiceClient
      .send<
        string,
        { invoiceId: number; invoiceName: string }
      >('get_invoice', { processId, data: { invoiceId: 12, invoiceName: 'asdasdas' } })
      .pipe(map((data) => new ResponseDto<string>(data)));
  }
}
