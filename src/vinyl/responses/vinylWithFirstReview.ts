import { Review } from 'src/reviews/entities';
import { Vinyl } from '../entities';
import { ApiProperty } from '@nestjs/swagger';

export class VinylWithFirstReview extends Vinyl {
  @ApiProperty({
    description: 'The first review on vinyl',
    type: Review,
    required: false,
  })
  reviews: Review[];

  @ApiProperty({
    description: "Vinyl's average score",
    minimum: 1,
    maximum: 5,
    nullable: true,
  })
  averageScore: number;
}
