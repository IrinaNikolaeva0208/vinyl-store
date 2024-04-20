import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortOrder } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationOptions {
  @ApiProperty({
    description: 'Pagination offset',
    example: 10,
    minimum: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Transform(({ value }) => +value)
  limit: number;

  @ApiProperty({
    description: 'Pagination limit',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => +value)
  offset: number;

  @ApiProperty({
    description: 'Sort order',
    example: SortOrder.ASC,
    enum: SortOrder,
    required: false,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;
}
