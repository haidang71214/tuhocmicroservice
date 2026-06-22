import { InvoiceTcpRequest } from '@common/interfaces/tcp/invoice/invoice-request.interfaces';
import { Invoice } from '@common/schemas/lib/invoice.schema';

export const invoiceRequestMapping = (data: InvoiceTcpRequest): Partial<Invoice> => {
  return {
    ...data,
    totalAmount: data.items.reduce((total, item) => total + item.total, 0),
    vatAmount: data.items.reduce((acc, item) => acc + item.unitPrice * item.quantity * (item.vatRate / 100), 0),
  };
};
