import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Vinyl } from 'src/vinyl/entities';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendNotification(email: string, vinyl: Vinyl) {
    await this.mailerService.sendMail({
      from: this.configService.get<string>('GMAIL_EMAIL'),
      to: email,
      subject: 'The payment was successfully completed!',
      text: `The payment (${vinyl.price}$) for your new vinyl record was successfully completed!\n\n
            Your new vinyl record:\n
            Name: ${vinyl.name}\n
            Author Name: ${vinyl.authorName}\n\n
            Please, leave a review of it!\n\n
            Best regards,\n
            Your vinyl store :)`,
    });
  }
}
