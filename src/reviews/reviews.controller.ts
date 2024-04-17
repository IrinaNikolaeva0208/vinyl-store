import { Body, Controller, Post, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Request } from 'express';
import { CreateReviewDto } from './dto/createReview.dto';
import { User } from 'src/users/entities';

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
}
