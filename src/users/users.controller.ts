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
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { PaginationOptions, UpdateProfileDto } from './dto';
import { ParseImagePipe } from 'src/utils/pipes';
import {
  ACCESS_TOKEN_COOKIE,
  AVATAR_FIELD,
  LOGOUT_REDIRECT_ROUTE,
  REFRESH_TOKEN_COOKIE,
} from 'src/utils/constants';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';

@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@ApiTags('Profile')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getProfile(
    @Query() paginationOptions: PaginationOptions,
    @Req() request: Request,
  ) {
    return this.usersService.getUserWithReviewsAndPurchasedVinyl(
      request.user.id,
      paginationOptions,
    );
  }

  @Patch()
  @UseInterceptors(FileInterceptor(AVATAR_FIELD))
  updateProfile(
    @UploadedFile(ParseImagePipe) file: Express.Multer.File | undefined,
    @Req() request: Request,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      request.user.id,
      file,
      updateProfileDto,
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@Req() request: Request, @Res() response: Response) {
    await this.usersService.deleteUserById(request.user.id);
    response
      .clearCookie(ACCESS_TOKEN_COOKIE)
      .clearCookie(REFRESH_TOKEN_COOKIE)
      .redirect(LOGOUT_REDIRECT_ROUTE);
  }
}
