import { Controller, Get } from '@nestjs/common';
import { VinylService } from './vinyl.service';

@Controller()
export class VinylController {
  constructor(private readonly appService: VinylService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
