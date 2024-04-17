import { IsInt, Min, Max, IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Max(5)
  @Min(1)
  @IsNotEmpty()
  score: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsUUID()
  vinylId: string;
}
