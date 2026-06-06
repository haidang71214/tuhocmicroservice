import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { SpireService } from './services/sprice.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, SpireService],
  exports: [PaymentService],
})
export class PaymentModule {}
