import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortOrder } from '../types';

export class PaginationOptions {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Transform(({ value }) => +value)
  limit: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => +value)
  offset: number;

  @IsEnum(SortOrder)
  @IsOptional()
  order?: SortOrder;
}
