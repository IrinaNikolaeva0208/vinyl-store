import { Review } from '../entities';
import { PaginationOptions } from '../dto';
import { ApiProperty } from '@nestjs/swagger';

class ReviewPaginationResultsParameters extends PaginationOptions {
  @ApiProperty({
    description: 'Reviews total number',
    example: 100,
  })
  total: number;
}

export class ReviewPaginationResults {
  @ApiProperty({ description: 'Required page of reviews', type: [Review] })
  data: Review[];

  @ApiProperty({
    description: 'Pagination parameters',
    type: ReviewPaginationResultsParameters,
  })
  pagination: ReviewPaginationResultsParameters;
}
