import { Module } from '@nestjs/common';
import { PDFController } from './controllers/app.controller';
import { PdfService } from './services/app.service';

@Module({
  controllers: [PDFController],
  providers: [PdfService],
})
export class PdfModule {}
