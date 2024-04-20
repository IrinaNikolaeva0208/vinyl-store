import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationOptions {
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

  @ApiProperty({
    description: 'Review Vinyl ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @IsUUID()
  @IsNotEmpty()
  vinylId: string;
}
