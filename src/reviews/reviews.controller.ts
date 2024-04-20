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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE } from 'src/utils/constants';

@ApiTags('Reviews')
@UseGuards(AdminOnlyGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

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

  @Public()
  @Get()
  getVinylReviews(@Query() paginationOptions: PaginationOptions) {
    return this.reviewsService.getVinylReviews(paginationOptions);
  }

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
