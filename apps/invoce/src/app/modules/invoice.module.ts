import { MongoProvider } from '@common/configuration/mongo.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceDestination } from '@common/schemas/lib/invoice.schema';
import { InvoiceController } from './invoice/controllers/invoice.controller';
import { InvoiceService } from './invoice/services/invoice.service';
import { InvoiceRepository } from './invoice/repositories/invoice.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    MongoProvider,
    MongooseModule.forFeature([InvoiceDestination]),
    ClientsModule.registerAsync([
      TcpProvider(TCP_SERVICES.PDF_GENERATOR_SERVICE),
      TcpProvider(TCP_SERVICES.MEDIA_SERVICE),
    ]),
    ClientsModule.register([
      {
        name: 'INVOICE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'invoice-clientId',
            brokers: ['localhost:9092'],
          },
        },
      },
    ]),
    PaymentModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
