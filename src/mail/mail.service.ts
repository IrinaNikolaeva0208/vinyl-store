import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GMAIL_EMAIL_CONFIG_KEY,
  PAYMENT_SUCCEDED_MAIL_SUBJECT,
  getPaymentSuccededMailText,
} from 'src/utils/constants';
import { Vinyl } from 'src/vinyl/entities';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendPaymentSuccededNotification(email: string, vinyl: Vinyl) {
    await this.mailerService.sendMail({
      from: this.configService.get<string>(GMAIL_EMAIL_CONFIG_KEY),
      to: email,
      subject: PAYMENT_SUCCEDED_MAIL_SUBJECT,
      text: getPaymentSuccededMailText(
        vinyl.price,
        vinyl.name,
        vinyl.authorName,
      ),
    });
  }
}
