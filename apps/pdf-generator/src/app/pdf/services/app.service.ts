import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  // cái này là để tạo dữ liệu
  async renderEjsTemplate(templatePath: string, data: any) {
    const fullPath = path.resolve(templatePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException(`file not found${fullPath}`);
    }
    return ejs.renderFile(fullPath, data);
  }

  async generateEjsPdf(templatePath: string, data: any) {
    const html = await this.renderEjsTemplate(templatePath, data);

    return { html };
  }
}
