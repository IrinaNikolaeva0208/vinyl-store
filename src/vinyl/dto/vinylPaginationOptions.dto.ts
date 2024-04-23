import { IsEnum, IsOptional } from 'class-validator';
import { PaginationOptions } from 'src/utils/dto';
import { PropertyToSortBy } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class VinylPaginationOptions extends PaginationOptions {
  @ApiProperty({
    description: 'Vinyl record property to sort by',
    example: PropertyToSortBy.NAME,
    enum: PropertyToSortBy,
    required: false,
  })
  @IsEnum(PropertyToSortBy)
  @IsOptional()
  sortBy?: PropertyToSortBy;
}
