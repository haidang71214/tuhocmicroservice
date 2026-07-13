import { Module } from '@nestjs/common';
import { AppController } from './controllers/authorize.controller';
import { AuthorizeService } from './services/authorize.service';
import { keyCloakModule } from '../keycloak/keycloak.module';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { AuthorizerGrpcController } from './controllers/authorizer-grpc.controller';
import { GRPC_SERVICES, gRPCPRovider } from '@common/configuration/gRPC.config';

@Module({
  imports: [
    keyCloakModule,
    ClientsModule.registerAsync([
      TcpProvider(TCP_SERVICES.USER_ACCESS_SERVICE),
      gRPCPRovider(GRPC_SERVICES.USER_ACCESS_SERVICE),
    ]),
  ],
  controllers: [AppController, AuthorizerGrpcController],
  providers: [AuthorizeService],
})
export class AuthorizeModule {}
