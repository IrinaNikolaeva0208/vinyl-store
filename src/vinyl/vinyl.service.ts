import { Injectable } from '@nestjs/common';

@Injectable()
export class VinylService {
  getHello(): string {
    return 'Hello World!';
  }
}
