import { Injectable, Logger } from '@nestjs/common';
import { SpireService } from './sprice.service';
import { CreateCheckoutSessionRequest } from '@common/interfaces/common/stripe.interface';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private readonly stripeService: SpireService) {}

  async createStripeSession(data: CreateCheckoutSessionRequest) {
    return this.stripeService.createCheckoutSession(data);
  }
}
