import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinylModule } from './vinyl/vinyl.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { PurchasesModule } from './purchases/purchases.module';
import { LogsModule } from './operationsLogs/logs.module';
import { options } from './database/ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(options),
    VinylModule,
    AuthModule,
    ReviewsModule,
    UsersModule,
    PurchasesModule,
    LogsModule,
  ],
})
export class AppModule {}
