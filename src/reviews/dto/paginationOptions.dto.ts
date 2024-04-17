import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { Transform } from 'class-transformer';

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

  @IsUUID()
  @IsNotEmpty()
  vinylId: string;
}
