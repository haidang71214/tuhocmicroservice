import { initTracing } from '@common/observable';

initTracing('invoice-service');
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as PinoLogger } from '@common/observable';
import { AppModule } from './app/app.module';
import { CONFIGURATION } from './Configuration';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      rawBody: true,
      bufferLogs: true,
    });
    app.useLogger(app.get(PinoLogger));

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: {
        host: CONFIGURATION.TCP_SERV.TCP_INVOICE_SERVICE.options?.host,
        port: CONFIGURATION.TCP_SERV.TCP_INVOICE_SERVICE.options?.port,
      },
    });
    const globalPrefix = CONFIGURATION.GLOBAL_PREFIX || 'api';
    app.setGlobalPrefix(globalPrefix);

    const config = new DocumentBuilder()
      .setTitle('Invoice Microservice API')
      .setDescription('Invoice microservice API documentation')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory);

    const port = process.env.INVOCE_PORT || 3309;
    // kích hoạt tất cả các microservice đã kết nối.
    await app.startAllMicroservices();

    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log(`📚 Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`);
    Logger.log('=======================================');
    Logger.log('GLOBAL_PREFIX: ', globalPrefix);
    Logger.log('PORT: ', port);
  } catch (error) {
    Logger.log(error);
  }
}

bootstrap();
