import { Transform } from 'class-transformer';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVinylDto {
  @ApiProperty({
    description: 'New vinyl record name',
    example: 'Lorem',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'New vinyl record description',
    example:
      'Necessitatibus contigo illum vinco sequi virga antiquus. Usus non provident volubilis.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'New vinyl record author name',
    example: 'Carrie Turner-Klocko',
    required: false,
  })
  @IsOptional()
  @IsString()
  authorName?: string;

  @ApiProperty({
    description: 'New vinyl record price',
    example: 99.99,
    minimum: 0.05,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Transform(({ value }) => +value)
  price?: number;

  @ApiProperty({
    description: 'New vinyl record image',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: any;
}
