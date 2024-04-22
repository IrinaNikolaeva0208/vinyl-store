import {
  Controller,
  Param,
  ParseUUIDPipe,
  Req,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Request } from 'express';
import { AdminOnly } from 'src/utils/decorators';
import { AdminOnlyGuard } from 'src/utils/guards';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE } from 'src/utils/constants';

@ApiTags('Reviews')
@UseGuards(AdminOnlyGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiNoContentResponse({ description: 'Successfully deleted review' })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiBadRequestResponse({ description: 'Invalid params' })
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @Delete(':id')
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @Param('id', ParseUUIDPipe) reviewId: string,
    @Req() request: Request,
  ) {
    await this.reviewsService.deleteVinylReview(reviewId, request.user.id);
  }
}
