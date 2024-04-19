import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NO_PHOTO_URL } from '../utils/constants';
import { Repository } from 'typeorm';
import { Vinyl } from './entities';
import { CreateVinylDto, UpdateVinylDto, SearchOptions } from './dto';
import { VinylPaginationOptions } from './dto';
import { SortOrder } from '../utils/types';
import { Review } from 'src/reviews/entities';
import { LogsService } from 'src/operationsLogs/logs.service';
import { Entity, Operation } from 'src/utils/types';

@Injectable()
export class VinylService {
  constructor(
    @InjectRepository(Vinyl) private vinylRepository: Repository<Vinyl>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly logsService: LogsService,
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

    await this.logVinylOperation(userId, savedVinyl.id, Operation.CREATE);
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

    await this.logVinylOperation(userId, id, Operation.UPDATE);

    return await this.vinylRepository.save({
      ...requiredVinyl,
      ...updateVinylDto,
      image,
    });
  }

  async deleteVinylById(id: string, userId: string) {
    await this.getVinylById(id);
    await this.logVinylOperation(userId, id, Operation.DELETE);
    await this.vinylRepository.delete(id);
  }

  async getVinylById(id: string) {
    const requiredVinyl = await this.vinylRepository.findOne({ where: { id } });
    if (!requiredVinyl) throw new NotFoundException('Vinyl not found');
    return requiredVinyl;
  }

  async getVinylPage(options: SearchOptions) {
    const filter: { name?: string; authorName?: string } = {};
    if (options.name) filter.name = options.name;
    if (options.authorName) filter.authorName = options.authorName;

    const result = await this.vinylRepository
      .createQueryBuilder('vinyl')
      .leftJoinAndMapMany(
        'vinyl.reviews',
        Review,
        'review',
        'review.vinylId = vinyl.id',
      )
      .skip(options.offset)
      .take(options.limit)
      .orderBy(
        options.sortBy
          ? {
              [options.sortBy]: options.order || SortOrder.ASC,
            }
          : {},
      )
      .where(filter)
      .getManyAndCount();

    return [
      result[0].map((vinyl) => ({
        ...vinyl,
        reviews: vinyl.reviews[0],
        averageScore:
          vinyl.reviews.reduce((prev, cur) => prev + cur.score, 0) /
          vinyl.reviews.length,
      })),
      result[1],
    ];
  }

  async logVinylOperation(
    userId: string,
    entityId: string,
    operation: Operation,
  ) {
    await this.logsService.createLog({
      performedByUser: userId,
      entity: Entity.VINYL,
      createdAt: Date.now(),
      operation,
      entityId,
    });
  }
}
