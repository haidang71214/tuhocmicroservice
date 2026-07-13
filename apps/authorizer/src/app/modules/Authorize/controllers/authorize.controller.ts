import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { RequestParams } from '@common/decorator/lib/request.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { TcpLoggingInterceptor } from '@common/interceptors/TcpLogging.interceptor';
import { AuthorizeService } from '../services/authorize.service';
import { AuthorizeResponse, LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';
import { ProcessId } from '@common/decorator/lib/processId.decorator';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AuthorierController {
  constructor(private readonly authorizeService: AuthorizeService) {}
  @MessagePattern(TCP_REQUEST_MESSAGE.Authorizer.LOGIN)
  async login(@RequestParams() data: LoginTcpRequest) {
    const result = await this.authorizeService.login(data);
    return Response.success<LoginTcpResponse>(result);
  }
  @MessagePattern(TCP_REQUEST_MESSAGE.Authorizer.VERIFY_USER_TOKEN)
  async verifyUserToken(@RequestParams() token: string, @ProcessId() processId: string) {
    const result = await this.authorizeService.verifyUserToken(token, processId);
    return Response.success<AuthorizeResponse>(result);
  }
}
