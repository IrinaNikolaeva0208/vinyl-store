import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { LogsService } from './logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
