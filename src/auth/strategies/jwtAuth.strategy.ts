import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cookieExtractor } from './cookie.extractor';
import { User } from '../../users/entities';
import {
  ACCESS_TOKEN_COOKIE,
  JWT_AUTH_STRATEGY_NAME,
  JWT_SECRET_CONFIG_KEY,
} from 'src/utils/constants';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(
  Strategy,
  JWT_AUTH_STRATEGY_NAME,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor(ACCESS_TOKEN_COOKIE),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_SECRET_CONFIG_KEY),
    });
  }

  async validate(payload: User) {
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
