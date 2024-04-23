import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewsPaginationOptions {
  @ApiProperty({
    description: 'Reviews pagination limit',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Transform(({ value }) => +value)
  limit: number;

  @ApiProperty({
    description: 'Reviews pagination offset',
    example: 5,
    minimum: 0,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => +value)
  offset: number;
}
