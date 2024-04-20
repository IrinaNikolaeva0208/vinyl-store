import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { GoogleProfile, Role } from '../types';
import {
  DEFAULT_STRING_VALUE,
  GOOGLE_CALLBACK_URL_CONFIG_KEY,
  GOOGLE_CLIENT_ID_CONFIG_KEY,
  GOOGLE_STRATEGY_NAME,
} from 'src/utils/constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  GOOGLE_STRATEGY_NAME,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>(GOOGLE_CLIENT_ID_CONFIG_KEY),
      clientSecret: configService.get<string>(GOOGLE_CLIENT_ID_CONFIG_KEY),
      callbackURL: configService.get<string>(GOOGLE_CALLBACK_URL_CONFIG_KEY),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, email, picture } = profile;

    const user = {
      firstName: name.givenName || DEFAULT_STRING_VALUE,
      lastName: name.familyName || DEFAULT_STRING_VALUE,
      avatar: picture || DEFAULT_STRING_VALUE,
      email: email,
      role: Role.USER,
    };

    done(null, user);
  }
}
