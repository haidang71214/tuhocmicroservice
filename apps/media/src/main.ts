import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MediaAppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(MediaAppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: MediaAppModule.CONFIGURATION.TCP_SERV.TCP_MEDIA_SERVICE.options?.host,
      port: MediaAppModule.CONFIGURATION.TCP_SERV.TCP_MEDIA_SERVICE.options?.port,
    },
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.MEDIA_PORT || 3000;
  // kích hoạt tất cả các microservice đã kết nối.
  await app.startAllMicroservices();

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
