import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';
import { CreateVinylDto } from './dto/createVinyl.dto';

@Injectable()
export class VinylService {
  constructor(
    @InjectRepository(Vinyl) private vinylRepository: Repository<Vinyl>,
  ) {}

  async getAll() {
    return await this.vinylRepository.find();
  }

  async create(createVinylDto: CreateVinylDto) {
    const newVinyl = this.vinylRepository.create(createVinylDto);
    return await this.vinylRepository.save(newVinyl);
  }
}
