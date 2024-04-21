import { Review } from 'src/reviews/entities';
import { User } from '../entities';
import { Purchase } from 'src/purchases/entities';
import { ApiProperty } from '@nestjs/swagger';

class ReviewsPaginationResultsParameters {
  @ApiProperty({
    description: 'Reviews pagination limit',
    example: 5,
    minimum: 1,
  })
  reviewsLimit: number;

  @ApiProperty({
    description: 'Reviews pagination offset',
    example: 5,
    minimum: 0,
  })
  reviewsOffset: number;

  @ApiProperty({
    description: 'Total number of reviews',
    example: 5,
  })
  totalReviews: number;
}

class PurchasesPaginationResultsParameters {
  @ApiProperty({
    description: 'Purchases pagination limit',
    example: 5,
    minimum: 1,
  })
  purchasesLimit: number;

  @ApiProperty({
    description: 'Purchases pagination offset',
    example: 5,
    minimum: 0,
  })
  purchasesOffset: number;

  @ApiProperty({
    description: 'Total number of purchases',
    example: 5,
  })
  totalPurchases: number;
}

class ReviewsPage {
  @ApiProperty({
    description: "Set of user's reviews",
    type: [Review],
  })
  data: Review[];

  @ApiProperty({
    description: 'Reviews pagination parameters',
    type: ReviewsPaginationResultsParameters,
  })
  pagination: ReviewsPaginationResultsParameters;
}

class PurchasesPage {
  @ApiProperty({
    description: "Set of user's purchases",
    type: [Purchase],
  })
  data: Purchase[];

  @ApiProperty({
    description: 'Purchases pagination parameters',
    type: PurchasesPaginationResultsParameters,
  })
  pagination: PurchasesPaginationResultsParameters;
}

export class ProfilePaginationResults extends User {
  @ApiProperty({
    description: 'Reviews page',
    type: ReviewsPage,
  })
  reviews: Review[];

  @ApiProperty({
    description: 'Purchases page',
    type: PurchasesPage,
  })
  purchases: Purchase[];
}
