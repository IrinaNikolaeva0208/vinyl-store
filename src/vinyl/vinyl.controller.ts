import { Controller, Get } from '@nestjs/common';
import { VinylService } from './vinyl.service';

@Controller('vinyl')
export class VinylController {
  constructor(private readonly appService: VinylService) {}

  @Get()
  getAllVinyl() {
    return this.appService.getAll();
  }
}
