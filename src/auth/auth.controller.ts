import { Controller, Get, UseGuards, Post, Req, Res } from '@nestjs/common';
import { GoogleOauthGuard, JwtRefreshGuard } from './guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { User } from './entities';
import { Public } from 'src/utils/public.decorator';

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
    response.cookie('access', accessToken, { httpOnly: true });
    response.cookie('refresh', refreshToken, { httpOnly: true });

    return { message: 'Successfully logged in' };
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
    response.cookie('access', accessToken, { httpOnly: true });

    return { message: 'Successfully refreshed' };
  }
}
