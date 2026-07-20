import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { InvoiceTcpRequest, SendInvoiceTcpRequest } from '@common/interfaces/tcp/invoice/invoice-request.interfaces';
import { invoiceRequestMapping } from '../mapper';
import { INVOICE_STATUS } from '@common/constant/enum/invoice.enum';
import { HTTP_MESSAGE } from '@invoce/constant';
import { ClientProxy } from '@nestjs/microservices';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { Invoice } from '@common/schemas/lib/invoice.schema';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: ClientProxy,
  ) {}

  createInvoiceService(params: InvoiceTcpRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }

  async sendById(params: SendInvoiceTcpRequest, processId: string) {
    const { invoiceId, userId } = params;
    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }
    if (invoice.status === INVOICE_STATUS.SENT) {
      throw new BadRequestException(HTTP_MESSAGE.ALREADY_EXISTS);
    }
    const base64 = await this.generatorPdf(invoice, processId);
    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: userId,
    });

    return { result: base64 };
  }

  generatorPdf(data: Invoice, processId: string) {
    return firstValueFrom(
      this.pdfGeneratorClient.send<string, { data: Invoice; processId: string }>(
        TCP_REQUEST_MESSAGE.PdfGenerator.CREATE_INVOICE_PDF,
        {
          data,
          processId,
        },
      ),
    );
  }
}
