import { Controller, Get, UseGuards, Post, Req, Res } from '@nestjs/common';
import { GoogleOauthGuard, JwtRefreshGuard } from './guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { User } from './entities';
import { Public } from 'src/utils/public.decorator';
import {
  AUTH_REDIRECT_ROUTE,
  LOGOUT_REDIRECT_ROUTE,
} from 'src/utils/constants';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async signInWithGoogle() {}

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
      .cookie('access', accessToken, { httpOnly: true })
      .cookie('refresh', refreshToken, { httpOnly: true })
      .redirect(AUTH_REDIRECT_ROUTE);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshAccessToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken } = await this.authService.signAccessToken(
      request.user as User,
    );

    response
      .cookie('access', accessToken, { httpOnly: true })
      .redirect(AUTH_REDIRECT_ROUTE);
  }

  @Get('logout')
  logout(@Res() response: Response) {
    response
      .clearCookie('access')
      .clearCookie('refresh')
      .redirect(LOGOUT_REDIRECT_ROUTE);
  }
}
