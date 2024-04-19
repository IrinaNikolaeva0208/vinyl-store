import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities';
import { LogsSearchOptions } from './dto';
import { Entity, Operation, SortOrder } from 'src/utils/types';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log) private readonly logsRepository: Repository<Log>,
  ) {}

  async createLog(log: Omit<Log, 'id'>) {
    const newLog = this.logsRepository.create(log);
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
    const filter: {
      entity?: Entity;
      entityId?: string;
      performedByUser?: string;
      operation?: Operation;
    } = {};
    if (options.entity) filter.entity = options.entity;
    if (options.entityId) filter.entityId = options.entityId;
    if (options.operation) filter.operation = options.operation;
    if (options.performedByUser)
      filter.performedByUser = options.performedByUser;

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
