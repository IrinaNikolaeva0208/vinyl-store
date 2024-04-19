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
import { LogsService } from 'src/operationsLogs/logs.service';
import { Entity, Operation } from 'src/utils/types';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly vinylService: VinylService,
    private readonly logsService: LogsService,
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

    const savedReview = await this.reviewsRepository.save(newReview);
    await this.logReviewOperation(authorId, savedReview.id, Operation.CREATE);
    return savedReview;
  }

  async deleteVinylReview(reviewId: string, userId: string) {
    const { affected } = await this.reviewsRepository.delete(reviewId);
    if (!affected) throw new NotFoundException('Review not found');
    await this.logReviewOperation(userId, reviewId, Operation.DELETE);
  }

  async checkIfReviewExists(authorId: string, vinylId: string) {
    const review = await this.reviewsRepository.findOne({
      where: { authorId, vinylId },
    });
    if (review)
      throw new ConflictException('Only one review per vinyl is allowed');
  }

  async getVinylReviews(options: PaginationOptions) {
    const { limit, offset, vinylId } = options;
    await this.vinylService.getVinylById(vinylId);
    const [reviewsPage, total] = await this.getReviewsPageForVinyl(
      limit,
      offset,
      vinylId,
    );
    return {
      data: reviewsPage,
      pagination: { ...options, total },
    };
  }

  async getReviewsPageForVinyl(limit: number, offset: number, vinylId: string) {
    return await this.reviewsRepository.findAndCount({
      where: { vinylId },
      take: limit,
      skip: offset,
    });
  }

  async getReviewsPageForUser(limit: number, offset: number, authorId: string) {
    return await this.reviewsRepository.findAndCount({
      where: { authorId },
      take: limit,
      skip: offset,
    });
  }

  async logReviewOperation(
    userId: string,
    entityId: string,
    operation: Operation,
  ) {
    await this.logsService.createLog({
      perfomedByUser: userId,
      createdAt: Date.now(),
      operation,
      entityId,
      entity: Entity.REVIEW,
    });
  }
}
