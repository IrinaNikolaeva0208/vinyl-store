import { PaginationOptions } from './paginationOptions.type';
import { IsOptional, IsAlphanumeric, IsAlpha } from 'class-validator';

export class SearchOptions extends PaginationOptions {
  @IsOptional()
  @IsAlphanumeric()
  name?: string;

  @IsOptional()
  @IsAlpha()
  authorName?: string;
}
