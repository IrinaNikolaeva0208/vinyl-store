import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VinylModule } from './vinyl/vinyl.module';

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
  ],
})
export class AppModule {}
