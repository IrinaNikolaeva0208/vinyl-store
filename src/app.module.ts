import { Module } from '@nestjs/common';
import { VinylModule } from './vinyl/vinyl.module';

@Module({
  imports: [VinylModule],
})
export class AppModule {}
