import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { firstValueFrom, map } from 'rxjs';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_CONFIG.SECRET_KEY')!, {
      apiVersion: '2026-06-24.dahlia' as any,
    });
  }

  async processWebhook(params: { signature: string; rawBody: Buffer; processId: string }) {
    const { rawBody, signature, processId } = params;

    const event = this.verifyWebhookSignature(rawBody, signature);
    this.logger.debug('Received event: ' + JSON.stringify(event, null, 2));

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.invoiceId) {
          this.logger.log(`Payment received for invoice ${session.metadata.invoiceId}`);
          await this.updateInvoicePaid({ invoiceId: session.metadata.invoiceId, processId });
        }

        break;
      }

      default:
        this.logger.log(`Unhandled event type ${event.type}`);
    }
  }

  verifyWebhookSignature(body: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
      this.configService.get<string>('STRIPE_CONFIG.WEBHOOK_SECRET')!,
    );
  }
  // cái này chỉ là cái update - thành thật thì nó không quan trọng lắm,
  updateInvoicePaid(params: { invoiceId: string; processId: string }) {
    const { invoiceId, processId } = params;

    return firstValueFrom(
      this.invoiceClient
        .send<any, any>(TCP_REQUEST_MESSAGE.Invoice.UPDATE_INVOICE_PAID, {
          data: invoiceId,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
}
