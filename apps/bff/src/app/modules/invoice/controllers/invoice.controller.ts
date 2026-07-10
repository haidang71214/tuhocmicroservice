import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { map } from 'rxjs';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { ProcessId } from '@common/decorator/lib/processId.decorator';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvoiceResponseDto, InvoiceRequestDto } from '@common/interfaces/gateway/invoice';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { InvoiceTcpRequest, InvoiceTcpResponse } from '@common/interfaces/tcp/invoice';
import { Authorization } from '@common/decorator/lib/authorizer.decorator';
import { UserData } from '@common/decorator/lib/userData.decorator';
import { AuthorizedMetadata } from '@common/interfaces/tcp/authorizer';
import { PERMISSION } from '@invoce/constant';
import { Permissons } from '@common/decorator/lib/permisson.decorator';
@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'create invoice' })
  @Authorization({ secured: true })
  @Permissons([PERMISSION.INVOICE_GET_BY_ID, PERMISSION.INVOICE_GET_ALL])
  async createInvoice(@Body() data: InvoiceRequestDto, @ProcessId() processId: string) {
    return this.invoiceClient.send<InvoiceTcpResponse, InvoiceTcpRequest>(TCP_REQUEST_MESSAGE.Invoice.CREATE, {
      data,
      processId,
    });
  }

  @Get('')
  @Authorization({ secured: true })
  async getInvoice(@ProcessId() processId: string, @UserData() userData: AuthorizedMetadata) {
    Logger.debug('user', userData);
    return this.invoiceClient
      .send<
        string,
        { invoiceId: number; invoiceName: string }
      >('get_invoice', { processId, data: { invoiceId: 12, invoiceName: 'asdasdas' } })
      .pipe(map((data) => new ResponseDto<string>(data)));
  }
}
