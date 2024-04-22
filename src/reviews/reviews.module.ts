import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities';
import { VinylModule } from 'src/vinyl/vinyl.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { LogsModule } from 'src/operationsLogs/logs.module';

@Module({
  imports: [
    forwardRef(() => VinylModule),
    TypeOrmModule.forFeature([Review]),
    LogsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
