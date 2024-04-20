import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { User } from '../users/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  GoogleStrategy,
  JwtAuthStrategy,
  JwtRefreshStrategy,
} from './strategies';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuard } from './guards';
import {
  JWT_SECRET_CONFIG_KEY,
  JWT_TOKEN_EXPIRES_IN_CONFIG_KEY,
} from 'src/utils/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(JWT_SECRET_CONFIG_KEY),
        signOptions: {
          expiresIn: configService.get(JWT_TOKEN_EXPIRES_IN_CONFIG_KEY),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
