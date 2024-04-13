import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from './cloudinary';
import { NO_PHOTO_URL } from '../utils/constants';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto } from './dto/createVinyl.dto';
import { PaginationOptions } from './types/paginationOptions.type';
import { SortOrder } from './types/sortOrder.enum';

@Injectable()
export class VinylService {
  constructor(
    @InjectRepository(Vinyl) private vinylRepository: Repository<Vinyl>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getVinylPaginationResults(paginationOptions: PaginationOptions) {
    if (paginationOptions.sortBy && !paginationOptions.order) {
      paginationOptions.order = SortOrder.ASC;
    }

    const [vinylPage, total] = await this.getVinylPage(paginationOptions);
    return {
      data: vinylPage,
      pagination: { ...paginationOptions, totalRecords: total },
    };
  }

  async create(
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

  async getVinylPage(paginationOptions: PaginationOptions) {
    return await this.vinylRepository.findAndCount({
      skip: paginationOptions.offset,
      take: paginationOptions.limit,
      order: paginationOptions.sortBy
        ? {
            [paginationOptions.sortBy]:
              paginationOptions.order || SortOrder.ASC,
          }
        : {},
    });
  }
}
