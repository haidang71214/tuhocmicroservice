import { Module } from '@nestjs/common';
import { AuthorierController } from './controllers/authorize.controller';
import { AuthorizeService } from './services/authorize.service';
import { keyCloakModule } from '../keycloak/keycloak.module';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { AuthorizerGrpcController } from './controllers/authorizer-grpc.controller';

@Module({
  imports: [keyCloakModule, ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.USER_ACCESS_SERVICE)])],
  controllers: [AuthorierController, AuthorizerGrpcController],
  providers: [AuthorizeService],
})
export class AuthorizeModule {}
