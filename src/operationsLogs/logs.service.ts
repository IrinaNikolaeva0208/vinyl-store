import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log) private readonly logsRepository: Repository<Log>,
  ) {}

  async createLog(log: Omit<Log, 'id'>) {
    const newLog = this.logsRepository.create(log);
    await this.logsRepository.save(newLog);
  }

  async getAllLogs() {
    return await this.logsRepository.find();
  }
}
