import { Module } from '@nestjs/common';
import { MailTemplateService } from './services/mail-template.service';

@Module({
  providers: [MailTemplateService],
  exports: [MailTemplateService],
})
export class MailTemplateModule {}
