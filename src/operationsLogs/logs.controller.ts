import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminOnly } from 'src/utils/decorators';
import { LogsService } from './logs.service';
import { LogsSearchOptions } from './dto';
import { AdminOnlyGuard } from 'src/utils/guards';

@UseGuards(AdminOnlyGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @AdminOnly()
  @Get()
  getSystemLogs(@Query() searchOptions: LogsSearchOptions) {
    return this.logsService.getLogsPaginationResults(searchOptions);
  }
}
