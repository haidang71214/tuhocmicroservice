import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { QUEUE } from '@common/constant/enum/queue';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const kafkaUrl = AppModule.CONFIGURATION.KAFKA_CONFIG.URL;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'email-service',
        brokers: [kafkaUrl],
      },
      consumer: {
        groupId: QUEUE.EMAIL_QUEUE,
        allowAutoTopicCreation: true,
      },
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.EMAIL_PORT || process.env.MAIL_PORT || 3314;

  await app.startAllMicroservices();
  await app.listen(port);
}

bootstrap();
