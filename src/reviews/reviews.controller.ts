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
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Request } from 'express';
import { CreateReviewDto } from './dto/createReview.dto';
import { User } from 'src/users/entities';
import { AdminOnly } from 'src/utils/decorators';

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

  @Delete(':id')
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(@Param('id', ParseUUIDPipe) reviewId: string) {
    await this.reviewsService.deleteVinylReview(reviewId);
  }
}
