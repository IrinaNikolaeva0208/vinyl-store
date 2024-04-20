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
import { ParseImagePipe } from 'src/utils/parseImage.pipe';
import { LOGOUT_REDIRECT_ROUTE } from 'src/utils/constants';

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
  @UseInterceptors(FileInterceptor('avatar'))
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
      .clearCookie('access')
      .clearCookie('refresh')
      .redirect(LOGOUT_REDIRECT_ROUTE);
  }
}
