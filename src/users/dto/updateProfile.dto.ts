import { IsAlpha, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'New user first name',
    example: 'Iryna',
    required: false,
  })
  @IsOptional()
  @IsAlpha()
  firstName?: string;

  @ApiProperty({
    description: 'New user last name',
    example: 'Nikalayeva',
    required: false,
  })
  @IsOptional()
  @IsAlpha()
  lastName?: string;

  @ApiProperty({
    description: 'New user birthdate',
    example: '2002-10-24',
    required: false,
  })
  @IsOptional()
  @IsDateString({ strict: true })
  birthdate?: string;
}
