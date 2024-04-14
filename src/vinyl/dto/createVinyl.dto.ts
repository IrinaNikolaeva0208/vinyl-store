import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsAlpha,
  IsAlphanumeric,
} from 'class-validator';

export class CreateVinylDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsAlpha()
  authorName: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Transform(({ value }) => +value)
  price: number;
}
