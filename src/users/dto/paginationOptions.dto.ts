import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationOptions {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Transform(({ value }) => +value)
  reviewsLimit: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => +value)
  reviewsOffset: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Transform(({ value }) => +value)
  purchasesLimit: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => +value)
  purchasesOffset: number;
}
