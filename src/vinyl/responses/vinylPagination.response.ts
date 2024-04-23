import { VinylPaginationOptions, SearchOptions } from '../dto';
import { ApiProperty } from '@nestjs/swagger';
import { VinylWithFirstReview } from './vinylWithFirstReview';

class VinylPaginationResultsParameters extends VinylPaginationOptions {
  @ApiProperty({
    description: 'Vinyl records total number',
    example: 100,
  })
  total: number;
}

export class VinylPaginationResults {
  @ApiProperty({
    description: 'Required page of vinyls',
    type: [VinylWithFirstReview],
  })
  data: VinylWithFirstReview[];

  @ApiProperty({
    description: 'Pagination parameters',
    type: VinylPaginationResultsParameters,
  })
  pagination: VinylPaginationResultsParameters;
}

class VinylSearchResultsParameters extends SearchOptions {
  @ApiProperty({
    description: 'Vinyl records total number',
    example: 100,
  })
  total: number;
}

export class VinylSearchResults {
  @ApiProperty({
    description: 'Required page of vinyls',
    type: [VinylWithFirstReview],
  })
  data: VinylWithFirstReview[];

  @ApiProperty({
    description: 'Pagination parameters',
    type: VinylSearchResultsParameters,
  })
  pagination: VinylSearchResultsParameters;
}
