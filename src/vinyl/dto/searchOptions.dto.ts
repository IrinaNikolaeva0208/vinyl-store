import { VinylPaginationOptions } from './vinylPaginationOptions.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchOptions extends VinylPaginationOptions {
  @ApiProperty({
    description: 'Vinyl record name to search for',
    example: 'Lorem',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Vinyl record name to search for',
    example: 'Carrie Turner-Klocko',
    required: false,
  })
  @IsOptional()
  @IsString()
  authorName?: string;
}
