import { IsOptional, IsEnum, IsUUID, IsBooleanString } from 'class-validator';
import { PaginationOptions } from 'src/utils/dto';
import { Entity, Operation } from 'src/utils/types';

export class LogsSearchOptions extends PaginationOptions {
  @IsBooleanString()
  @IsOptional()
  sortByTime?: boolean;

  @IsOptional()
  @IsEnum(Entity)
  entity?: Entity;

  @IsOptional()
  @IsUUID()
  performedByUser?: string;

  @IsOptional()
  @IsUUID()
  entityId?: string;

  @IsOptional()
  @IsEnum(Operation)
  operation?: Operation;
}
