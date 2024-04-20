import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVinylDto {
  @ApiProperty({
    description: 'Vinyl record name',
    example: 'Lorem',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Vinyl record description',
    example:
      'Necessitatibus contigo illum vinco sequi virga antiquus. Usus non provident volubilis.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Vinyl record author name',
    example: 'Carrie Turner-Klocko',
  })
  @IsNotEmpty()
  @IsString()
  authorName: string;

  @ApiProperty({
    description: 'Vinyl record price',
    example: 99.99,
    minimum: 0.05,
  })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.05)
  @Transform(({ value }) => +value)
  price: number;
}
