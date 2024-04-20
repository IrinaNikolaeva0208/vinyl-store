import { Transform } from 'class-transformer';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateVinylDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  authorName: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Transform(({ value }) => +value)
  price: number;
}
