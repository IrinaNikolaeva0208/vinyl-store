import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities';
import { cookieExtractor } from './cookie.extractor';
import {
  JWT_REFRESH_SECRET_CONFIG_KEY,
  JWT_REFRESH_STRATEGY_NAME,
  REFRESH_TOKEN_COOKIE,
} from 'src/utils/constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_STRATEGY_NAME,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor(REFRESH_TOKEN_COOKIE),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_REFRESH_SECRET_CONFIG_KEY),
    });
  }

  async validate(payload: User) {
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
