import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/createReview.dto';
import { VinylService } from 'src/vinyl/vinyl.service';
import { PaginationOptions } from './dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly vinylService: VinylService,
  ) {}

  async createReviewOnVinyl(
    authorId: string,
    createReviewDto: CreateReviewDto,
  ) {
    await this.vinylService.getVinylById(createReviewDto.vinylId);
    await this.checkIfReviewExists(authorId, createReviewDto.vinylId);
    const newReview = this.reviewsRepository.create({
      ...createReviewDto,
      authorId,
    });
    return await this.reviewsRepository.save(newReview);
  }

  async deleteVinylReview(reviewId: string) {
    const { affected } = await this.reviewsRepository.delete(reviewId);
    if (!affected) throw new NotFoundException('Review not found'); //
  }

  async checkIfReviewExists(authorId: string, vinylId: string) {
    const review = await this.reviewsRepository.findOne({
      where: { authorId, vinylId },
    });
    if (review)
      throw new ConflictException('Only one review per vinyl is allowed');
  }

  async getVinylReviews(options: PaginationOptions) {
    await this.vinylService.getVinylById(options.vinylId);
    const [reviewsPage, total] = await this.getReviewsPage(options);
    return {
      data: reviewsPage,
      pagination: { ...options, total },
    };
  }

  async getReviewsPage({ limit, offset, vinylId }: PaginationOptions) {
    return await this.reviewsRepository.findAndCount({
      where: { vinylId },
      take: limit,
      skip: offset,
    });
  }
}
