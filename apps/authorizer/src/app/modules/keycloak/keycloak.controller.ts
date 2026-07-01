import { Controller, UseInterceptors } from '@nestjs/common';
import { KeyCloakHttpService } from './keycloak-http.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { RequestParams } from '@common/decorator/lib/request.decorator';
import { CreateKeyCloakTcpReq } from '@common/interfaces/tcp/authorizer';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { TcpLoggingInterceptor } from '@common/interceptors/TcpLogging.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class keycloakController {
  constructor(private readonly keycloakHttpService: KeyCloakHttpService) {}
  @MessagePattern(TCP_REQUEST_MESSAGE.KeyCloak.CREATE_USER)
  async create(@RequestParams() data: CreateKeyCloakTcpReq): Promise<Response<string>> {
    const result = await this.keycloakHttpService.createUser(data);
    return Response.success(result);
  }
}
