import { TCP_SERVICES, TcpConfiguration, TcpProvider } from '@common/configuration/tcp.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthorizeController } from './controller/authorizer.controller';

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)])],
  controllers: [AuthorizeController],
  providers: [],
})
export class AuthorizeModule {}
