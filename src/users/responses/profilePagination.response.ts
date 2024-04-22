import { Review } from 'src/reviews/entities';
import { Purchase } from 'src/purchases/entities';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationOptions } from '../dto';

class PaginationResultsParameters extends PaginationOptions {
  @ApiProperty({
    description: 'Total number of entities',
    example: 5,
  })
  total: number;
}

export class ReviewsPaginationResults {
  @ApiProperty({
    description: "Set of user's reviews",
    type: [Review],
  })
  data: Review[];

  @ApiProperty({
    description: 'Reviews pagination parameters',
    type: PaginationResultsParameters,
  })
  pagination: PaginationResultsParameters;
}

export class PurchasesPaginationResults {
  @ApiProperty({
    description: "Set of user's purchases",
    type: [Purchase],
  })
  data: Purchase[];

  @ApiProperty({
    description: 'Purchases pagination parameters',
    type: PaginationResultsParameters,
  })
  pagination: PaginationResultsParameters;
}
