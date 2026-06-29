import { Module } from '@nestjs/common';
import { AppController } from './controllers/authorize.controller';
import { AuthorizeService } from './services/authorize.service';
import { keyCloakModule } from '../keycloak/keycloak.module';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';

@Module({
  imports: [keyCloakModule, ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.USER_ACCESS_SERVICE)])],
  controllers: [AppController],
  providers: [AuthorizeService],
})
export class AuthorizeModule {}
