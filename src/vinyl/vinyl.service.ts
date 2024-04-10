import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vinyl } from './entities/vinyl.entity';

@Injectable()
export class VinylService {
  constructor(
    @InjectRepository(Vinyl) private vinylRepository: Repository<Vinyl>,
  ) {}

  async getAll() {
    return await this.vinylRepository.find();
  }
}
