import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';

@Controller()
export class EmailController {
  private readonly logger = new Logger(EmailController.name);
  @EventPattern('invoice_sent')
  async handleInvoiceSent(@Payload() payload, @Ctx() context: KafkaContext) {
    this.logger.log('Received : ', payload);
    this.logger.log(context);
  }
}
