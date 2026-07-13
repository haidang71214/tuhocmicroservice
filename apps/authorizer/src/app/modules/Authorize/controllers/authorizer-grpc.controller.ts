import { Controller } from '@nestjs/common';
import { AuthorizeService } from '../services/authorize.service';
import { GrpcMethod } from '@nestjs/microservices';
import { VerifyUserTokenRequest, VerifyUserTokenResponse } from '@common/interfaces/grpc/authorizer';
import { ResponseGrpc } from '@common/interfaces/grpc/common/Response.interface';
@Controller()
export class AuthorizerGrpcController {
  constructor(private readonly authorizerService: AuthorizeService) {}

  @GrpcMethod('AuthorizerService', 'verifyUserToken')
  async verifyUserToken(params: VerifyUserTokenRequest): Promise<VerifyUserTokenResponse> {
    const result = await this.authorizerService.verifyUserToken(params.token, params.processId);
    return ResponseGrpc.success(result);
  }
}
