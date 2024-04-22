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
  Post,
  ParseUUIDPipe,
  Param,
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
import {
  ApiTags,
  ApiCookieAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { User } from './entities';
import { ProfilePaginationResults } from './responses';
import { AdminOnly } from 'src/utils/decorators';

@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@ApiTags('Profile')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'Recieved profile',
    type: ProfilePaginationResults,
  })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiBadRequestResponse({ description: 'Invalid query params' })
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
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'Profile was successfully updated',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
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

  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@Req() request: Request, @Res() response: Response) {
    await this.usersService.deleteUserById(request.user.id);
    response
      .clearCookie(ACCESS_TOKEN_COOKIE)
      .clearCookie(REFRESH_TOKEN_COOKIE)
      .redirect(LOGOUT_REDIRECT_ROUTE);
  }

  @ApiCreatedResponse({
    description: 'User role was successfully changed to admin',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiBadRequestResponse({ description: 'Invalid ID provided' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @AdminOnly()
  @Post(':id')
  assignUserAsAdmin(@Param('id', ParseUUIDPipe) userId: string) {
    return this.usersService.changeUserRoleToAdmin(userId);
  }
}
