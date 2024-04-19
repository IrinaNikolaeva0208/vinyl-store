import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { VinylController } from './vinyl.controller';
import { VinylService } from './vinyl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vinyl } from './entities';
import { LogsModule } from 'src/operationsLogs/logs.module';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([Vinyl]), LogsModule],
  controllers: [VinylController],
  providers: [VinylService],
  exports: [VinylService],
})
export class VinylModule {}
