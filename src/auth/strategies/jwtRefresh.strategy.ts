import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities';
import { cookieExtractor } from './cookie.extractor';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor('refresh')]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_KEY'),
    });
  }

  async validate(payload: User) {
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
