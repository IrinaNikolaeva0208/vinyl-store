import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          port: 465,
          host: 'smtp.gmail.com',
          auth: {
            user: configService.get<string>('GMAIL_EMAIL'),
            pass: configService.get<string>('GMAIL_APP_PASS'),
          },
          secure: true,
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      }),
    }),
    ConfigModule.forRoot(),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
