import { IsInt, Min, Max, IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Your vinyl record score',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  score: number;

  @ApiProperty({
    description: 'Your comment',
    example: 'Not bad :)',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty({
    description: 'Vinyl ID',
    example: '31c32908-abd3-4897-be47-88bdaaef0bc1',
  })
  @IsNotEmpty()
  @IsUUID()
  vinylId: string;
}
