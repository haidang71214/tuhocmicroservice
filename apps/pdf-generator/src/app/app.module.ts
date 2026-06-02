import { Module } from '@nestjs/common';
import { PdfModule } from './pdf/app.module';
import { InvoicePdfModule } from './invoice/invoice.pdf.module';
import { CONFIGURATION, TConfiguration } from '../Configuration';

@Module({
  imports: [PdfModule, InvoicePdfModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
