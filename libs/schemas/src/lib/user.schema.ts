import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { Model, Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'user',
})
export class User extends BaseSchema {
  @Prop({ required: true, trim: true })
  firstName!: string;
  @Prop({ required: true, trim: true })
  lastName!: string;
  @Prop({ required: true, trim: true, unique: true })
  email!: string;
  @Prop({ required: true, trim: true, unique: true })
  userId!: string;
  @Prop({ required: true, trim: true, unique: true })
  password!: string; // lưu vào đây để lần sau không cần đăng nhập vào keycloak nữa
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  role!: Types.ObjectId[];
}
export const userModuleName = User.name;
export const userSchema = createSchema(User);
export type UserModel = Model<User>;
export const userDestination = {
  name: userModuleName,
  schema: userSchema,
};
