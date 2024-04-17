import { IsAlpha, IsOptional, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsAlpha()
  firstName?: string;

  @IsOptional()
  @IsAlpha()
  lastName?: string;

  @IsOptional()
  @IsDateString({ strict: true })
  birthdate?: string;
}
