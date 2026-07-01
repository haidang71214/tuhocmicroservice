import { CreateUserTCPRequest } from '@common/interfaces/tcp/user';
import { User } from '@common/schemas/lib/user.schema';
import { Types } from 'mongoose';

export const createUserRequestMapping = (data: CreateUserTCPRequest): Partial<User> => {
  return {
    ...data,
    role: data.role?.map((role) => new Types.ObjectId(role)) ?? [],
  };
};
