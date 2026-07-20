import { INVOICE_STATUS } from '@common/constant/enum/invoice.enum';
import { Invoice, InvoiceModelName } from '@common/schemas/lib/invoice.schema';
import type { InvoiceModel } from '@common/schemas/lib/invoice.schema';
import { InjectModel } from '@nestjs/mongoose';

export class InvoiceRepository {
  constructor(@InjectModel(InvoiceModelName) private readonly invoiceModel: InvoiceModel) {}

  // khi mình dùng partial thì mình sẽ chưa mong muốn là data sẽ truyền tất cả các fields.
  // nó sẽ làm tất cả kiểu dữ liệ trong Invoice trở thành optional hết.
  create(data: Partial<Invoice>) {
    return this.invoiceModel.create({ ...data, status: INVOICE_STATUS.CREATE });
  }
  getById(id: string) {
    return this.invoiceModel.findById(id);
  }

  getAll() {
    return this.invoiceModel.find();
  }

  updateById(id: string, data: Partial<Invoice>) {
    return this.invoiceModel.findByIdAndUpdate(id, data, { new: true });
  }

  deleteById(id: string) {
    return this.invoiceModel.findByIdAndDelete(id);
  }

  findById(id: string) {
    return this.invoiceModel.findById(id);
  }
}
