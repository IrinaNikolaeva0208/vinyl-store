import { Module } from '@nestjs/common';
import { VinylController } from './vinyl.controller';
import { VinylService } from './vinyl.service';

@Module({
  imports: [],
  controllers: [VinylController],
  providers: [VinylService],
})
export class VinylModule {}
