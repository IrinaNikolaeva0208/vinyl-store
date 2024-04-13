import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from './cloudinary';
import { NO_PHOTO_URL } from '../utils/constants';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto, UpdateVinylDto } from './dto';
import { PaginationOptions } from './types/paginationOptions.type';
import { SortOrder } from './types/sortOrder.enum';
import { SearchOptions } from './types/searchOptions.type';

@Injectable()
export class VinylService {
  constructor(
    @InjectRepository(Vinyl) private vinylRepository: Repository<Vinyl>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getVinylPaginationResults<Options extends PaginationOptions>(
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
  ) {
    const url = file
      ? (await this.cloudinaryService.uploadImage(file)).url
      : NO_PHOTO_URL;

    const newVinyl = this.vinylRepository.create({
      ...createVinylDto,
      image: url,
    });

    return await this.vinylRepository.save(newVinyl);
  }

  async updateVinylById(
    id: string,
    updateVinylDto: UpdateVinylDto,
    file: Express.Multer.File | undefined,
  ) {
    const requiredVinyl = await this.getVinylById(id);
    const image = file
      ? (await this.cloudinaryService.uploadImage(file)).url
      : requiredVinyl.image;

    return await this.vinylRepository.save({
      ...requiredVinyl,
      ...updateVinylDto,
      image,
    });
  }

  async deleteVinylById(id: string) {
    await this.getVinylById(id);
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

    return await this.vinylRepository.findAndCount({
      skip: options.offset,
      take: options.limit,
      order: options.sortBy
        ? {
            [options.sortBy]: options.order || SortOrder.ASC,
          }
        : {},
      where: filter,
    });
  }
}
