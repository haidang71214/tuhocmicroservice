import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { SendMailOptions } from '@common/interfaces/common/email.interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_CONFIG.MAIL_HOST'),
      port: this.config.get<number>('MAIL_CONFIG.MAIL_PORT'),
      secure: false,
      auth: {
        user: this.config.get<string>('MAIL_CONFIG.MAIL_USER'),
        pass: this.config.get<string>('MAIL_CONFIG.MAIL_PASS'),
      },
    });
  }

  async sendMail({ to, subject, html, text, senderName, senderEmail, attachments }: SendMailOptions) {
    const defaultName =
      this.config.get<string>('MAIL_CONFIG.MAIL_SENDER_NAME') || this.config.get<string>('MAIL_CONFIG.SENDER_NAME');
    const defaultEmail =
      this.config.get<string>('MAIL_CONFIG.MAIL_SENDER_EMAIL') || this.config.get<string>('MAIL_CONFIG.SENDER_EMAIL');

    const mailOptions = {
      from: `"${senderName ?? defaultName}" <${senderEmail ?? defaultEmail}>`,
      to,
      subject,
      html,
      text: text ?? (html ? html.replace(/<[^>]+>/g, '') : ''),
      attachments,
    };

    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error(`❌ Failed to send mail to ${to}:`, error);
      throw error;
    }
  }
}
