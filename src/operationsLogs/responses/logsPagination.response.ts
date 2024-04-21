import { ApiProperty } from '@nestjs/swagger';
import { LogsSearchOptions } from '../dto';
import { Log } from '../entities';

class LogsSearchResultParameters extends LogsSearchOptions {
  @ApiProperty({
    description: 'Logs total number',
    example: 100,
  })
  total: number;
}

export class LogsSearchResults {
  @ApiProperty({ description: 'Required page of logs', type: [Log] })
  data: Log[];

  @ApiProperty({
    description: 'Pagination parameters',
    type: LogsSearchResultParameters,
  })
  pagination: LogsSearchResultParameters;
}
