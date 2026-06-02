import { InvoiceRequestDto } from '../../gateway/invoice/invoice-request.dto';
export type InvoiceTcpRequest = InvoiceRequestDto;
export type SendInvoiceTcpRequest = {
  invoiceId: string;
  userId: string; // trong cái nghiệp vụ thì sẽ có id của người tạo á.
};
