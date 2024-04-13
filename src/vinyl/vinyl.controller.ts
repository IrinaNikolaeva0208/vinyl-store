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
import { FILE_TYPE, MAX_FILE_SIZE } from '../utils/constants';
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
  async createVinyl(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: FILE_TYPE,
        })
        .addMaxSizeValidator({
          maxSize: MAX_FILE_SIZE,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File | undefined,
    @Body() createVinylDto: CreateVinylDto,
  ) {
    return this.appService.create(createVinylDto, file);
  }
}
