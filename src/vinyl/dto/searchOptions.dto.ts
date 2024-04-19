import { VinylPaginationOptions } from './vinylPaginationOptions.dto';
import { IsOptional, IsAlphanumeric, IsAlpha } from 'class-validator';

export class SearchOptions extends VinylPaginationOptions {
  @IsOptional()
  @IsAlphanumeric()
  name?: string;

  @IsOptional()
  @IsAlpha()
  authorName?: string;
}
