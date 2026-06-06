import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { InvoiceTcpRequest, SendInvoiceTcpRequest } from '@common/interfaces/tcp/invoice/invoice-request.interfaces';
import { invoiceRequestMapping } from '../mapper';
import { INVOICE_STATUS } from '@common/constant/enum/invoice.enum';
import { HTTP_MESSAGE } from '@invoce/constant';
import { UploadfileTcpRequest } from '@common/interfaces/tcp/media/media.request';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { Invoice } from '@common/schemas/lib/invoice.schema';
import { firstValueFrom, map } from 'rxjs';
import type { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { PaymentService } from '../../payment/services/payment.service';
import { createCheckoutSessionMapping } from '../mapper/index';
@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly paymentService: PaymentService,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
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
    const fileUrl = await this.uploadPdf(
      {
        fileBase64: base64.data,
        fileName: `invoice-${invoice._id}.pdf`,
      },
      processId,
    );
    const checkoutLink = await this.paymentService.createStripeSession(createCheckoutSessionMapping(invoice));

    if (!fileUrl) {
      throw new BadRequestException('Upload file failed');
    }
    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: userId,
      fileUrl,
    });

    return checkoutLink.url;
  }

  generatorPdf(data: Invoice, processId: string) {
    return firstValueFrom(
      this.pdfGeneratorClient.send<string, Invoice>(TCP_REQUEST_MESSAGE.PdfGenerator.CREATE_INVOICE_PDF, {
        data,
        processId,
      }),
    );
  }
  // như này là được rồi, giờ sẽ qua tạo cái uploadfileTcpRequest.
  uploadPdf(data: UploadfileTcpRequest, processId: string) {
    return firstValueFrom(
      this.mediaClient
        .send<string, UploadfileTcpRequest>(TCP_REQUEST_MESSAGE.Media.UPLOAD_FILE, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }

  async updateInvoicePaid(invoiceId: string) {
    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }
    return this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.PAID,
    });
  }
}
