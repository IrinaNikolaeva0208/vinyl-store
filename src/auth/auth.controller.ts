import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { GoogleOauthGuard } from './guards';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { User } from './entities';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async signInWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async execGoogleCallback(@Req() request: Request, @Res() response: Response) {
    const user = await this.authService.createGoogleIfNotExists(
      request.user as User,
    );
    const { accessToken } = await this.authService.signTokens(user);
    response.cookie('accessToken', accessToken);
    response.status(HttpStatus.OK).json({ message: 'Successfully logged in' });
  }
}
