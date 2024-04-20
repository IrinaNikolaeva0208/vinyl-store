import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminOnly } from 'src/utils/decorators';
import { LogsService } from './logs.service';
import { LogsSearchOptions } from './dto';
import { AdminOnlyGuard } from 'src/utils/guards';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE } from 'src/utils/constants';

@ApiTags('Logs')
@UseGuards(AdminOnlyGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @AdminOnly()
  @Get()
  getSystemLogs(@Query() searchOptions: LogsSearchOptions) {
    return this.logsService.getLogsPaginationResults(searchOptions);
  }
}
