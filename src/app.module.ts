import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinylModule } from './vinyl/vinyl.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { PurchasesModule } from './purchases/purchases.module';
import { LogsModule } from './operationsLogs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST'),
        username: configService.get<string>('PG_USER'),
        password: configService.get<string>('PG_PASSWORD'),
        database: configService.get<string>('PG_DATABASE'),
        entities: ['dist/**/*.entity.js'],
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        synchronize: true,
      }),
    }),
    VinylModule,
    AuthModule,
    ReviewsModule,
    UsersModule,
    PurchasesModule,
    LogsModule,
  ],
})
export class AppModule {}
