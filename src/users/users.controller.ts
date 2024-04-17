import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Delete,
  Req,
  Res,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto';
import { ParseImagePipe } from 'src/utils/parseImage.pipe';
import { User } from './entities';
import { LOGOUT_REDIRECT_ROUTE } from 'src/utils/constants';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getProfile(@Req() request: Request) {
    return this.usersService.getUserById((request.user as User).id);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  updateProfile(
    @UploadedFile(ParseImagePipe) file: Express.Multer.File | undefined,
    @Req() request: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      (request.user as User).id,
      file,
      updateProfileDto,
    );
  }

  @Delete()
  async deleteProfile(@Req() request: Request, @Res() response: Response) {
    await this.usersService.deleteUserById((request.user as User).id);
    response
      .clearCookie('access')
      .clearCookie('refresh')
      .redirect(LOGOUT_REDIRECT_ROUTE);
  }
}
