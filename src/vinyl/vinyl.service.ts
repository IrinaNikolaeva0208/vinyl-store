import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from './cloudinary';
import { NO_PHOTO_URL } from '../utils/constants';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto } from './dto/createVinyl.dto';

@Injectable()
export class VinylService {
  constructor(
    @InjectRepository(Vinyl) private vinylRepository: Repository<Vinyl>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getAll() {
    return await this.vinylRepository.find();
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
}
