import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Delete,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Request } from 'express';
import { CreateReviewDto } from './dto/createReview.dto';
import { AdminOnly, Public } from 'src/utils/decorators';
import { PaginationOptions } from './dto';
import { AdminOnlyGuard } from 'src/utils/guards';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE } from 'src/utils/constants';
import { Review } from './entities';
import { ReviewPaginationResults } from './responses';

@ApiTags('Reviews')
@UseGuards(AdminOnlyGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiCreatedResponse({ description: 'Review was created', type: Review })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiNotFoundResponse({ description: 'Vinyl not found' })
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @Post()
  postVinylReview(
    @Req() requset: Request,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReviewOnVinyl(
      requset.user.id,
      createReviewDto,
    );
  }

  @ApiOkResponse({
    description: 'Recieved vinyl reviews',
    type: ReviewPaginationResults,
  })
  @ApiBadRequestResponse({ description: 'Invalid query params' })
  @ApiNotFoundResponse({ description: 'Vinyl not found' })
  @Public()
  @Get()
  getVinylReviews(@Query() paginationOptions: PaginationOptions) {
    return this.reviewsService.getVinylReviews(paginationOptions);
  }

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
