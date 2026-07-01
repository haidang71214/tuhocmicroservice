import { Type } from '@nestjs/common';
import { Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Schema, Types } from 'mongoose';

export class BaseSchema {
  _id!: Types.ObjectId;
  @Virtual({
    get: function (this: any) {
      return this._id?.toString();
    },
  })
  id!: string;
  @Prop({ type: Date, default: () => new Date() })
  createdAt!: Date;

  @Prop({ type: Date, default: () => new Date() })
  updatedAt!: Date;
}
// ở đây mình sẽ truyền cái class Invoice (ở dưới) vào đây
// ờm, mình cứ hiểu đây là 1 kiểu custom lại cái createForClass
export const createSchema = <TClass = any>(target: Type<TClass>): Schema => {
  const schema = SchemaFactory.createForClass(target);
  schema.set('toJSON', {
    virtuals: true,
  });
  schema.set('toObject', {
    virtuals: true,
  });
  schema.set('versionKey', false);
  schema.set('timestamps', true);

  return schema;
};
