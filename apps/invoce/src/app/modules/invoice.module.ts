import { MongoProvider } from '@common/configuration/mongo.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceDestination } from '@common/schemas/lib/invoice.schema';
import { InvoiceController } from './invoice/controllers/invoice.controller';
import { InvoiceService } from './invoice/services/invoice.service';
import { InvoiceRepository } from './invoice/repositories/invoice.repository';
@Module({
  imports: [MongoProvider, MongooseModule.forFeature([InvoiceDestination])],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
