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
import {
  ReviewsPaginationResults,
  PurchasesPaginationResults,
} from './responses';
import { AdminOnly } from 'src/utils/decorators';

@ApiCookieAuth(ACCESS_TOKEN_COOKIE)
@ApiTags('Profile')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'Recieved profile',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @Get()
  getProfile(@Req() request: Request) {
    return this.usersService.getUserById(request.user.id);
  }

  @ApiOkResponse({
    description: "Recieved user's purchases",
    type: PurchasesPaginationResults,
  })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiBadRequestResponse({ description: 'Invalid query params' })
  @Get('/purchases')
  getPurchases(
    @Query() paginationOptions: PaginationOptions,
    @Req() request: Request,
  ) {
    return this.usersService.getUserPurchases(
      request.user.id,
      paginationOptions,
    );
  }

  @ApiOkResponse({
    description: "Recieved user's reviews",
    type: ReviewsPaginationResults,
  })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiBadRequestResponse({ description: 'Invalid query params' })
  @Get('/reviews')
  getReviews(
    @Query() paginationOptions: PaginationOptions,
    @Req() request: Request,
  ) {
    return this.usersService.getUserReviews(request.user.id, paginationOptions);
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
  async assignUserAsAdmin(@Param('id', ParseUUIDPipe) userId: string) {
    return await this.usersService.changeUserRoleToAdmin(userId);
  }
}
