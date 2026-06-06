import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async renderEjsTemplate(templatePath: string, data: any): Promise<string> {
    const fullPath = path.resolve(templatePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException(`file not found${fullPath}`);
    }
    return ejs.renderFile(fullPath, data);
  }

  async generatePdfFromEjs(templatePath: string, data: any): Promise<Uint8Array> {
    const html = await this.renderEjsTemplate(templatePath, data);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' as any });
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }
}
