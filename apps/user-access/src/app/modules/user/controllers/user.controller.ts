import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { RequestParams } from '@common/decorator/lib/request.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { UserService } from '../services/user.service';
import { CreateUserTCPRequest, UpdateUserTCPRequest, UserTcpResponse } from '@common/interfaces/tcp/user';
import { TcpLoggingInterceptor } from '@common/interceptors/TcpLogging.interceptor';
import { ProcessId } from '@common/decorator/lib/processId.decorator';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.User.CREATE)
  async create(
    @RequestParams() data: CreateUserTCPRequest,
    @ProcessId() processId: string,
  ): Promise<Response<UserTcpResponse>> {
    const result = await this.userService.create(data, processId);
    return Response.success(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.User.GET_ALL)
  async getAll(@RequestParams() _params: any): Promise<Response<UserTcpResponse[]>> {
    const result = await this.userService.getAll();
    return Response.success(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.User.GET_BY_ID)
  async getById(@RequestParams() data: { id: string }): Promise<Response<UserTcpResponse>> {
    const result = await this.userService.getById(data.id);
    return Response.success(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.User.UPDATE_BY_ID)
  async updateById(
    @RequestParams() data: { id: string; data: UpdateUserTCPRequest },
  ): Promise<Response<UserTcpResponse>> {
    const result = await this.userService.getByUserId(data.id);
    return Response.success(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.User.DELETE_BY_ID)
  async deleteById(@RequestParams() data: { id: string }): Promise<Response<null>> {
    await this.userService.getById(data.id);
    return Response.success(null);
  }
}
