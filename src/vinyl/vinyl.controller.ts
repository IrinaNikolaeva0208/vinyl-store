import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { CreateVinylDto } from './dto/createVinyl.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vinyl')
export class VinylController {
  constructor(private readonly appService: VinylService) {}

  @Get()
  getAllVinyl() {
    return this.appService.getAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createVinyl(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 50000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() createVinylDto: CreateVinylDto,
  ) {
    return this.appService.create(createVinylDto);
  }
}
