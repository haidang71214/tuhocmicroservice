import { Type } from '@nestjs/common';
import { Prop, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Schema, Types } from 'mongoose';

export class BaseSchema {
  // với mongo, mình hiểu là sẽ có fields _id
  // nhưng khi lên bbackend rất hạn chế trong việc để _id
  // thế nên mình cần custom 1 cái virtual fields nhằm mục đích handle trường hợp đó.
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
