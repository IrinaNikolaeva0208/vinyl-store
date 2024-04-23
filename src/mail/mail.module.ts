import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  GMAIL_APP_PASS_CONFIG_KEY,
  GMAIL_EMAIL_CONFIG_KEY,
  TRANSPORTER_DEFAULT_FROM,
  TRANSPORTER_HOST,
} from 'src/utils/constants';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          port: 465,
          host: TRANSPORTER_HOST,
          auth: {
            user: configService.get<string>(GMAIL_EMAIL_CONFIG_KEY),
            pass: configService.get<string>(GMAIL_APP_PASS_CONFIG_KEY),
          },
          secure: true,
        },
        defaults: {
          from: TRANSPORTER_DEFAULT_FROM,
        },
      }),
    }),
    ConfigModule.forRoot(),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
