import { InvoicePdfService } from '../services/invoice.pdf.servicec';
import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/TcpLogging.interceptor';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { RequestParams } from '@common/decorator/lib/request.decorator';
import { Invoice } from '@common/schemas/lib/invoice.schema';
import { Response } from '@common/interfaces/tcp/common/response.interface';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvcoiePdfController {
  constructor(private readonly pdfService: InvoicePdfService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PdfGenerator.CREATE_INVOICE_PDF)
  async generateInvoicePdf(@RequestParams() params: Invoice): Promise<Response<string>> {
    const buffer = await this.pdfService.generateInvoicePdf(params);
    return Response.success<string>(Buffer.from(buffer).toString('base64'));
  }
}
