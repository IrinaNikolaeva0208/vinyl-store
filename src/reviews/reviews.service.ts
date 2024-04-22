import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities';
import { Repository } from 'typeorm';
import { CreateReviewDto } from '../vinyl/dto/createReview.dto';
import { LogsService } from 'src/operationsLogs/logs.service';
import { Operation } from 'src/utils/types';
import {
  ONE_REVIEW_ALLOWED_MESSAGE,
  REVIEW_NOT_FOUND_MESSAGE,
} from 'src/utils/constants';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly logsService: LogsService,
  ) {}

  async createReviewOnVinyl(
    authorId: string,
    vinylId: string,
    createReviewDto: CreateReviewDto,
  ) {
    await this.checkIfReviewExists(authorId, vinylId);
    const newReview = this.reviewsRepository.create({
      ...createReviewDto,
      authorId,
      vinylId,
    });

    const savedReview = await this.reviewsRepository.save(newReview);
    await this.logsService.createLog(
      authorId,
      savedReview.id,
      Operation.CREATE,
    );
    return savedReview;
  }

  async deleteVinylReview(reviewId: string, userId: string) {
    const { affected } = await this.reviewsRepository.delete(reviewId);
    if (!affected) throw new NotFoundException(REVIEW_NOT_FOUND_MESSAGE);
    await this.logsService.createLog(userId, reviewId, Operation.DELETE);
  }

  async checkIfReviewExists(authorId: string, vinylId: string) {
    const review = await this.reviewsRepository.findOne({
      where: { authorId, vinylId },
    });
    if (review) throw new ConflictException(ONE_REVIEW_ALLOWED_MESSAGE);
  }

  async getPageForVinyl(limit: number, offset: number, vinylId: string) {
    return await this.reviewsRepository.findAndCount({
      where: { vinylId },
      take: limit,
      skip: offset,
    });
  }

  async getPageForUser(limit: number, offset: number, authorId: string) {
    return await this.reviewsRepository.findAndCount({
      where: { authorId },
      take: limit,
      skip: offset,
    });
  }
}
