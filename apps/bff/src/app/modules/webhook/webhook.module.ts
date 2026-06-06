import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { WebhookController } from './webhook.controller';
import { StripeWebhookService } from './webhook.service';

@Module({
  imports: [ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.INVOICE_SERVICE)])],
  controllers: [WebhookController],
  providers: [StripeWebhookService],
})
export class WebhookModule {}
