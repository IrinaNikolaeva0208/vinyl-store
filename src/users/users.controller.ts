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
import { UsersService } from './users.service';
import { User } from './entities';
import { LOGOUT_REDIRECT_ROUTE } from 'src/utils/constants';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('profile')
export class UsersController {
  constructor(private readonly userservice: UsersService) {}

  @Get()
  getProfile(@Req() request: Request) {
    return this.userservice.getUserById((request.user as User).id);
  }

  @Delete()
  async deleteProfile(@Req() request: Request, @Res() response: Response) {
    await this.userservice.deleteUserById((request.user as User).id);
    response
      .clearCookie('access')
      .clearCookie('refresh')
      .redirect(LOGOUT_REDIRECT_ROUTE);
  }
}
