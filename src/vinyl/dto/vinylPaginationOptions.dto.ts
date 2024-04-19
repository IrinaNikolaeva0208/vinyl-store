import { IsEnum, IsOptional } from 'class-validator';
import { PaginationOptions } from 'src/utils/dto';
import { PropertyToSortBy } from '../types';

export class VinylPaginationOptions extends PaginationOptions {
  @IsEnum(PropertyToSortBy)
  @IsOptional()
  sortBy?: PropertyToSortBy;
}
