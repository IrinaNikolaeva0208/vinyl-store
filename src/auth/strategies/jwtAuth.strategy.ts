import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { cookieExtractor } from './cookie.extractor';
import { User } from '../entities';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor('access')]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: User) {
    return { id: payload.id, email: payload.email };
  }
}
