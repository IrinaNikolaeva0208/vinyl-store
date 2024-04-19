import { Controller, Get } from '@nestjs/common';
import { AdminOnly } from 'src/utils/decorators';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @AdminOnly()
  @Get()
  getSystemLogs() {
    return this.logsService.getAllLogs();
  }
}
