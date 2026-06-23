import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { InvoiceTcpRequest } from '@common/interfaces/tcp/invoice/invoice-request.interfaces';
import { invoiceRequestMapping } from '../mapper';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}
  createInvoiceService(params: InvoiceTcpRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }
}
