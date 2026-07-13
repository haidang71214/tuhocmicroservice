import { Controller } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { ResponseGrpc } from '@common/interfaces/grpc/common/Response.interface';
import { User } from '@common/schemas/lib/user.schema';

// params phải match với proto: message UserById { string id = 1; string processId = 2; }
type UserByIdParams = {
  id: string;
  processId: string;
};

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserAccessService', 'getByUserId')
  async getByUserId(params: UserByIdParams): Promise<ResponseGrpc<User>> {
    const result = await this.userService.getByUserId(params.id);
    return ResponseGrpc.success(result);
  }
}
