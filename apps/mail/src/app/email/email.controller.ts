import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { MailService } from '../../modules/mail/services/mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('invoice_sent')
  invoiceSentEvent(
    @Payload()
    payload: { invoiceId?: string; clientEmail?: string; data?: { invoiceId?: string; clientEmail?: string } },
    @Ctx() context: KafkaContext,
  ) {
    Logger.debug({ payload, context });

    const clientEmail = payload?.clientEmail || payload?.data?.clientEmail;
    const invoiceId = payload?.invoiceId || payload?.data?.invoiceId;

    if (clientEmail) {
      this.mailService.sendMail({
        subject: 'Mail invoice',
        to: clientEmail,
        text: `Invoice: ${invoiceId}`,
      });
    }
  }
}
