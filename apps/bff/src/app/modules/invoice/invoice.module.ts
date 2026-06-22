import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from '@common/interceptors/Exception.interceptor';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { InvoiceController } from './controllers/invoice.controller';
@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.INVOICE_SERVICE)])],
  controllers: [InvoiceController],
  providers: [],
})
export class InvoiceModule {}
