import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { userModuleName, UserModel, User } from '@common/schemas/lib/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(userModuleName) private readonly userModel: UserModel) {}

  getAll() {
    return this.userModel.find().exec();
  }

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  getById(id: string) {
    return this.userModel.findById(id).exec();
  }

  getByUserId(userId: string) {
    return this.userModel.findOne({ userId }).populate('role').exec();
  }

  getByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async exists(email: string): Promise<boolean> {
    const result = await this.userModel.exists({ email }).exec();
    return !!result;
  }
}
