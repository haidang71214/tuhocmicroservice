/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { initTracing } from '@common/observable';

initTracing('bff-service');

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger as PinoLogger } from '@common/observable';
import { AppModule } from './app/app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      rawBody: true,
      bufferLogs: true,
    });
    app.useLogger(app.get(PinoLogger));
    const globalPrefix = AppModule.CONFIGURATION.GLOBAL_PREFIX;
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Length', 'Date', 'Set-Cookie'],
      maxAge: 60 * 60 * 24, // 24 hours
    });
    // Swagger Documentation
    const config = new DocumentBuilder()
      .setTitle('E-bff API')
      .setDescription('The E-bff API description')
      .setVersion('1.0.0')
      .addBearerAuth({
        description: 'Default JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
      })
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory);

    const port = AppModule.CONFIGURATION.APP_CONFIG.PORT;
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log('=======================================');
    Logger.log('GLOBAL_PREFIX: ', globalPrefix);
    Logger.log('PORT: ', port);
  } catch (error) {
    Logger.log(error);
  }
}

bootstrap();
