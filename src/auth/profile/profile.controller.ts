import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Delete,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProfileService } from './profile.service';
import { User } from '../entities';
import { LOGOUT_REDIRECT_ROUTE } from 'src/utils/constants';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Req() request: Request) {
    return this.profileService.getProfileById((request.user as User).id);
  }

  @Delete()
  async deleteProfile(@Req() request: Request, @Res() response: Response) {
    await this.profileService.deleteProfileById((request.user as User).id);
    response
      .clearCookie('access')
      .clearCookie('refresh')
      .redirect(LOGOUT_REDIRECT_ROUTE);
  }
}
