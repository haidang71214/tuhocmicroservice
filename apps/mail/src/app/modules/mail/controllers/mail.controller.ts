import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { MailInvoiceService } from '../services/mail-invoice.service';
import { InvoiceSentPayload } from '@common/interfaces/queue/invoice';

@Controller()
export class MailController {
  constructor(private readonly mailInvoiceService: MailInvoiceService) {}

  @EventPattern('invoice-sent')
  async invoiceSentEvent(@Payload() payload: InvoiceSentPayload, @Ctx() context: KafkaContext) {
    Logger.debug({ payload, context });

    await this.mailInvoiceService.sendInvoice(payload);
  }
}
