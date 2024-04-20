import { VinylPaginationOptions } from './vinylPaginationOptions.dto';
import { IsOptional, IsString } from 'class-validator';

export class SearchOptions extends VinylPaginationOptions {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  authorName?: string;
}
