import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary';
import { VinylController } from './vinyl.controller';
import { VinylService } from './vinyl.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vinyl } from './entities';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([Vinyl])],
  controllers: [VinylController],
  providers: [VinylService],
})
export class VinylModule {}
