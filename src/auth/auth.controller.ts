import { Controller, Get, UseGuards, Post, Req, Res } from '@nestjs/common';
import { GoogleOauthGuard, JwtRefreshGuard } from './guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { User } from '../users/entities';
import { Public } from '../utils/decorators';
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_REDIRECT_ROUTE,
  LOGOUT_REDIRECT_ROUTE,
  REFRESH_TOKEN_COOKIE,
} from 'src/utils/constants';
import { AdminOnlyGuard } from '../utils/guards';
import {
  ApiCookieAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@UseGuards(AdminOnlyGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async signInWithGoogle() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async execGoogleCallback(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.createGoogleIfNotExists(
      request.user as User,
    );

    const { accessToken, refreshToken } =
      await this.authService.getFreshTokens(user);
    response
      .cookie(ACCESS_TOKEN_COOKIE, accessToken, { httpOnly: true })
      .cookie(REFRESH_TOKEN_COOKIE, refreshToken, { httpOnly: true })
      .redirect(AUTH_REDIRECT_ROUTE);
  }

  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiCookieAuth(REFRESH_TOKEN_COOKIE)
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshAccessToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.signAccessToken(
      request.user,
    );

    response
      .cookie(ACCESS_TOKEN_COOKIE, accessToken, { httpOnly: true })
      .redirect(AUTH_REDIRECT_ROUTE);
  }

  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @Get('logout')
  logout(@Res() response: Response) {
    response
      .clearCookie(ACCESS_TOKEN_COOKIE)
      .clearCookie(REFRESH_TOKEN_COOKIE)
      .redirect(LOGOUT_REDIRECT_ROUTE);
  }
}
