import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { PurchasesService } from './purchases.service';
import { VinylModule } from 'src/vinyl/vinyl.module';
import { PurchasesController } from './purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities';
import { MailModule } from 'src/mail/mail.module';
import { LogsModule } from 'src/operationsLogs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    VinylModule,
    TypeOrmModule.forFeature([Purchase]),
    MailModule,
    LogsModule,
  ],
  controllers: [PurchasesController],
  providers: [StripeService, PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
