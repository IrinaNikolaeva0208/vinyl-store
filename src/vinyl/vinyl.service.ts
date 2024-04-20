import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NO_PHOTO_URL, VINYL_NOT_FOUND_MESSAGE } from '../utils/constants';
import { Repository } from 'typeorm';
import { Vinyl } from './entities';
import { CreateVinylDto, UpdateVinylDto, SearchOptions } from './dto';
import { VinylPaginationOptions } from './dto';
import { SortOrder } from '../utils/types';
import { LogsService } from 'src/operationsLogs/logs.service';
import { Operation } from 'src/utils/types';

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

    const result = await this.vinylRepository.findAndCount({
      skip: options.offset,
      take: options.limit,
      where: filter,
      order: options.sortBy
        ? {
            [options.sortBy]: options.order || SortOrder.ASC,
          }
        : {},
      relations: { reviews: true },
    });

    return this.mapReviewAndCountScore(result);
  }

  mapReviewAndCountScore(vinylPage: [Vinyl[], number]) {
    return [
      vinylPage[0].map((vinyl) => ({
        ...vinyl,
        reviews: vinyl.reviews[0],
        averageScore:
          vinyl.reviews.reduce((prev, cur) => prev + cur.score, 0) /
          vinyl.reviews.length,
      })),
      vinylPage[1],
    ];
  }
}
