import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from './cloudinary';
import { NO_PHOTO_URL } from '../utils/constants';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto, UpdateVinylDto } from './dto';
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
