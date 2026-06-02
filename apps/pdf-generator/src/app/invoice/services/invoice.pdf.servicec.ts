import { Injectable } from '@nestjs/common';
import { PdfService } from '../../pdf/services/app.service';
import { InvoiceTcpResponse } from '@common/interfaces/tcp/invoice';
import * as path from 'path';

@Injectable()
export class InvoicePdfService {
  constructor(private readonly pdfService: PdfService) {}

  async generateInvoicePdf(invoice: InvoiceTcpResponse): Promise<Uint8Array<ArrayBufferLike>> {
    const templatePath = path.join(__dirname, 'templates', 'einvoice.templates.ejs');
    const subtotal = invoice.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    const data = {
      client: invoice.client,
      status: invoice.status,
      items: invoice.items,
      vatAmount: invoice.vatAmount,
      totalAmount: invoice.totalAmount,
      subtotal,
    };

    return this.pdfService.generatePdfFromEjs(templatePath, data);
  }
}
