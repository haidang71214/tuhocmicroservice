import { Controller, Get, Header } from '@nestjs/common';

import path from 'path';
import { PdfService } from '../services/app.service';
@Controller()
export class PDFController {
  private readonly templatePath = path.join(__dirname, 'templates', 'einvoice.templates.ejs');
  constructor(private readonly pdfService: PdfService) {}
  @Get()
  printEjsPdf() {
    return this.pdfService.renderEjsTemplate(this.templatePath, { einvoice: { id: 1 } });
  }
}
