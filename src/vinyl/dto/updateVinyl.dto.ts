import { Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  Min,
  IsAlpha,
  IsAlphanumeric,
  IsOptional,
} from 'class-validator';

export class UpdateVinylDto {
  @IsOptional()
  @IsAlphanumeric()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsAlpha()
  authorName: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Transform(({ value }) => +value)
  price: number;
}
