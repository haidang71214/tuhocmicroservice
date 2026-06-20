import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { INVOICE_STATUS } from '@common/constant/enum/invoice.enum';

export class Client {
  @Prop({ type: String })
  name!: string;
  @Prop({ type: String })
  email!: string;
  @Prop({ type: String })
  address!: string;
}

export class Item {
  @Prop({ type: String })
  productId!: string;

  @Prop({ type: String })
  name!: string;

  @Prop({ type: Number })
  quantity?: number;

  @Prop({ type: Number })
  unitPrice!: number;

  @Prop({ type: Number })
  vatRate!: number;

  @Prop({ type: Number })
  total!: number;
}

@Schema({
  collection: 'invoice',
})
export class Invoice extends BaseSchema {
  @Prop({ type: Client })
  client!: Client;

  @Prop({ type: [Item] })
  items!: Item[];

  @Prop({ type: Number })
  totalAmount!: number;

  @Prop({ type: Number })
  vatAmount!: number;

  @Prop({ type: String, enum: INVOICE_STATUS, default: INVOICE_STATUS.CREATE })
  status!: INVOICE_STATUS;
}
// đăng kí schema cho mongo.
export const InvoiceSchema = createSchema(Invoice);
export const InvoiceModelName = Invoice.name;
// hồi trước mình làm thì mình cũng phải import từng cái này vô module để sử dụng
// nhưng giờ mình có thể custom nó vào đây luôn.
export const InvoiceDestination = {
  name: InvoiceModelName,
  schema: InvoiceSchema,
};
// CÁCH CŨ (Chỉ có Schema), mình sẽ khá là quằn chỗ này
// MongooseModule.forFeature([
//   { name: Invoice.name, schema: InvoiceSchema }
// ])
export type InvoiceModel = Model<Invoice>;
