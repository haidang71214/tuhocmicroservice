import { Module } from '@nestjs/common';
import { InvcoiePdfController } from './controllers/invoice.pdf.controller';
import { InvoicePdfService } from './services/invoice.pdf.servicec';
import { PdfModule } from '../pdf/app.module';
@Module({
  imports: [PdfModule],
  controllers: [InvcoiePdfController],
  providers: [InvoicePdfService],
})
export class InvoicePdfModule {}
