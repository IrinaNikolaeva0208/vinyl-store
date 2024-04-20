import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities';
import { LogsSearchOptions } from './dto';
import { SortOrder, Operation, Entity } from 'src/utils/types';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log) private readonly logsRepository: Repository<Log>,
  ) {}

  async createLog(userId: string, entityId: string, operation: Operation) {
    const newLog = this.logsRepository.create({
      performedByUser: userId,
      entity: Entity.VINYL,
      createdAt: Date.now(),
      operation,
      entityId,
    });
    await this.logsRepository.save(newLog);
  }

  async getLogsPaginationResults(options: LogsSearchOptions) {
    if (options.sortByTime && !options.order) {
      options.order = SortOrder.ASC;
    }

    const [logsPage, total] = await this.getLogsPage(options);
    return {
      data: logsPage,
      pagination: { ...options, total },
    };
  }

  async getLogsPage(options: LogsSearchOptions) {
    const { entity, entityId, performedByUser, operation } = options;
    const filter = { entity, entityId, performedByUser, operation };
    Object.keys(filter).forEach(
      (key) => filter[key] === undefined && delete filter[key],
    );

    return await this.logsRepository.findAndCount({
      where: filter,
      skip: options.offset,
      take: options.limit,
      order: options.sortByTime
        ? {
            createdAt: options.order || SortOrder.ASC,
          }
        : {},
    });
  }
}
