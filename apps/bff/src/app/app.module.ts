import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../Configuration';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from '@common/interceptors/Exception.interceptor';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { AuthorizeModule } from './modules/Authorize/authorize.module';
import { UserGuard } from '@common/guard/user.guard';
import { PermissionGuard } from '@common/guard/permisson.guard';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { RedisProvider } from '@common/configuration/redis.config';
import { ThrottlerProvider } from '@common/configuration/throttler.config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GRPC_SERVICES, gRPCPRovider } from '@common/configuration/gRPC.config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [() => CONFIGURATION] }),
    InvoiceModule,
    ProductModule,
    UserModule,
    AuthorizeModule,
    ThrottlerProvider,
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)]),
    RedisProvider,
    ClientsModule.registerAsync([gRPCPRovider(GRPC_SERVICES.AUTHORIZER_SERVICE)]),
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ExceptionInterceptor },
    { provide: APP_GUARD, useClass: UserGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule implements NestModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    // Áp dụng LoggerMiddleware cho TẤT CẢ các route
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
