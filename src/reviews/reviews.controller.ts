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
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Request } from 'express';
import { CreateReviewDto } from './dto/createReview.dto';
import { User } from 'src/users/entities';
import { AdminOnly, Public } from 'src/utils/decorators';
import { PaginationOptions } from './dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  postVinylReview(
    @Req() requset: Request,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReviewOnVinyl(
      (requset.user as User).id,
      createReviewDto,
    );
  }

  @Public()
  @Get()
  getVinylReviews(@Query() paginationOptions: PaginationOptions) {
    return this.reviewsService.getVinylReviews(paginationOptions);
  }

  @Delete(':id')
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(@Param('id', ParseUUIDPipe) reviewId: string) {
    await this.reviewsService.deleteVinylReview(reviewId);
  }
}
