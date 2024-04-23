import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NO_PHOTO_URL, VINYL_NOT_FOUND_MESSAGE } from '../utils/constants';
import { Repository } from 'typeorm';
import { Vinyl } from './entities';
import {
  CreateVinylDto,
  UpdateVinylDto,
  SearchOptions,
  ReviewsPaginationOptions,
  CreateReviewDto,
} from './dto';
import { VinylPaginationOptions } from './dto';
import { SortOrder } from '../utils/types';
import { LogsService } from 'src/operationsLogs/logs.service';
import { Operation } from 'src/utils/types';
import { Review } from 'src/reviews/entities';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class VinylService {
  constructor(
    @InjectRepository(Vinyl) private vinylRepository: Repository<Vinyl>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly logsService: LogsService,
    @Inject(forwardRef(() => ReviewsService))
    private reviewsService: ReviewsService,
  ) {}

  async getVinylPaginationResults<Options extends VinylPaginationOptions>(
    options: Options,
  ) {
    if (options.sortBy && !options.order) {
      options.order = SortOrder.ASC;
    }

    const [vinylPage, total] = await this.getVinylPage(options);
    return {
      data: vinylPage,
      pagination: { ...options, total },
    };
  }

  async getVinylReviews(vinylId: string, options: ReviewsPaginationOptions) {
    const { limit, offset } = options;
    await this.getVinylById(vinylId);
    const [reviewsPage, total] = await this.reviewsService.getPageForVinyl(
      limit,
      offset,
      vinylId,
    );
    return {
      data: reviewsPage,
      pagination: { ...options, total },
    };
  }

  async createReviewOnVinyl(
    authorId: string,
    vinylId: string,
    createReviewDto: CreateReviewDto,
  ) {
    await this.getVinylById(vinylId);
    return await this.reviewsService.createReviewOnVinyl(
      authorId,
      vinylId,
      createReviewDto,
    );
  }

  async createVinyl(
    createVinylDto: CreateVinylDto,
    file: Express.Multer.File | undefined,
    userId: string,
  ) {
    const url = file
      ? (await this.cloudinaryService.uploadImage(file)).url
      : NO_PHOTO_URL;

    const newVinyl = this.vinylRepository.create({
      ...createVinylDto,
      image: url,
    });
    const savedVinyl = await this.vinylRepository.save(newVinyl);

    await this.logsService.createLog(userId, savedVinyl.id, Operation.CREATE);
    return savedVinyl;
  }

  async updateVinylById(
    id: string,
    updateVinylDto: UpdateVinylDto,
    file: Express.Multer.File | undefined,
    userId: string,
  ) {
    const requiredVinyl = await this.getVinylById(id);
    const image = file
      ? (await this.cloudinaryService.uploadImage(file)).url
      : requiredVinyl.image;

    await this.logsService.createLog(userId, id, Operation.UPDATE);

    return await this.vinylRepository.save({
      ...requiredVinyl,
      ...updateVinylDto,
      image,
    });
  }

  async deleteVinylById(id: string, userId: string) {
    await this.getVinylById(id);
    await this.logsService.createLog(userId, id, Operation.DELETE);
    await this.vinylRepository.delete(id);
  }

  async getVinylById(id: string) {
    const requiredVinyl = await this.vinylRepository.findOne({ where: { id } });
    if (!requiredVinyl) throw new NotFoundException(VINYL_NOT_FOUND_MESSAGE);
    return requiredVinyl;
  }

  async getVinylPage(options: SearchOptions) {
    const { name, authorName } = options;
    const filter = { name, authorName };
    Object.keys(filter).forEach(
      (key) => filter[key] === undefined && delete filter[key],
    );

    const result = await this.vinylRepository
      .createQueryBuilder('vinyl')
      .leftJoinAndMapOne(
        'vinyl.reviews',
        Review,
        'review',
        'review.vinylId = vinyl.id',
      )
      .addSelect(
        '(SELECT AVG("r"."score") FROM "review" "r" WHERE "r"."vinylId" = "vinyl"."id") AS "averageScore"',
      )
      .addSelect('(SELECT COUNT(*) FROM "vinyl") AS "total"')
      .groupBy('vinyl.id')
      .addGroupBy('review.id')
      .skip(options.offset)
      .take(options.limit)
      .orderBy(
        options.sortBy
          ? {
              ['vinyl.' + options.sortBy]: options.order || SortOrder.ASC,
            }
          : {},
      )
      .where(filter)
      .getRawAndEntities();

    return this.preparePageForResponse(result);
  }

  preparePageForResponse(result: { entities: Vinyl[]; raw: any[] }) {
    const total = +result.raw[0].total;
    const vinylsForResonse = result.entities.map((item, index) => {
      while (item.id != result.raw[index]['vinyl_id']) index++;
      const score = result.raw[index].averageScore;
      return {
        ...item,
        averageScore: score && +(+score).toFixed(2),
      };
    });

    return [vinylsForResonse, total];
  }
}
