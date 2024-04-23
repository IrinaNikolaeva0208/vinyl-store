import { IsOptional, IsEnum, IsUUID, IsBooleanString } from 'class-validator';
import { PaginationOptions } from 'src/utils/dto';
import { Entity, Operation } from 'src/utils/types';
import { ApiProperty } from '@nestjs/swagger';

export class LogsSearchOptions extends PaginationOptions {
  @ApiProperty({
    description: 'Should results be sorted by time',
    example: true,
    required: false,
  })
  @IsBooleanString()
  @IsOptional()
  sortByTime?: boolean;

  @ApiProperty({
    description: 'Logs for entity',
    example: Entity.USER,
    enum: Entity,
    required: false,
  })
  @IsOptional()
  @IsEnum(Entity)
  entity?: Entity;

  @ApiProperty({
    description: 'Who performed the operation',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  performedByUser?: string;

  @ApiProperty({
    description: 'Logs for entity by its ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiProperty({
    description: 'Operation type',
    example: Operation.CREATE,
    required: false,
    enum: Operation,
  })
  @IsOptional()
  @IsEnum(Operation)
  operation?: Operation;
}
