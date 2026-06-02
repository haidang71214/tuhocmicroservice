import { Controller, UseInterceptors } from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { MessagePattern } from '@nestjs/microservices';
import { TcpLoggingInterceptor } from '@common/interceptors/TcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { ProcessId } from '@common/decorator/lib/processId.decorator';
import { RequestParams } from '@common/decorator/lib/request.decorator';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import type {
  InvoiceTcpRequest,
  SendInvoiceTcpRequest,
} from '@common/interfaces/tcp/invoice/invoice-request.interfaces';
import { InvoiceTcpResponse } from '@common/interfaces/tcp/invoice/invoice-response.interfaces';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceSerivcec: InvoiceService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.Invoice.CREATE)
  async createInvoice(@RequestParams() params: InvoiceTcpRequest): Promise<Response<InvoiceTcpResponse>> {
    const result = await this.invoiceSerivcec.createInvoiceService(params);
    return Response.success<InvoiceTcpResponse>(result);
  }

  @MessagePattern('get_invoice')
  getInvoice(
    @ProcessId() processId: string,
    @RequestParams() params: { invoiceId: number; invoiceName: string }, // producer truyền cái nào, cái đó sẽ được lấy ở trong nnày.
  ): Response<string> {
    return Response.success(`hello bro ${params.invoiceId + params.invoiceName}`);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.Invoice.SEND)
  async sendById(
    @ProcessId() processId: string,
    @RequestParams() params: SendInvoiceTcpRequest,
  ): Promise<Response<any>> {
    const result = await this.invoiceSerivcec.sendById(params, processId);
    return Response.success<any>(result);
  }
}
