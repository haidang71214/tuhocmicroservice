import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { ProcessId } from '@common/decorator/lib/processId.decorator';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { Body, Controller, Inject, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';
import { LoginResponseDto, LoginRequestDto } from '@common/interfaces/gateway/authorize';
import { LoginTcpResponse, LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
@ApiTags('authorize')
@Controller('auth')
export class AuthorizeController {
  constructor(@Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly tcpAuth: TcpClient) {}
  // khi mà viết như này, bản chất nó đang tiêm cái cấu hình của authorize_service vào
  // ở phầnexport function TcpProvider(serviceName: keyof TcpConfiguration): ClientsProviderAsyncOptions {
  //   return {
  //     //do nó là môi trường cần nàp vào, config provider ở file riêng
  //     name: serviceName,
  @Post('login')
  @ApiOkResponse({ type: ResponseDto<LoginResponseDto> })
  @ApiOperation({ summary: 'login' })
  async login(@Body() data: LoginRequestDto, @ProcessId() processId: string) {
    return this.tcpAuth
      .send<LoginTcpResponse, LoginTcpRequest>(TCP_REQUEST_MESSAGE.Authorizer.LOGIN, {
        data,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
