import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { FILE_TYPE, MAX_FILE_SIZE } from '../utils/constants';
import { CreateVinylDto } from './dto/createVinyl.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationOptions } from './types/paginationOptions.type';

@Controller('vinyl')
export class VinylController {
  constructor(private readonly vinylService: VinylService) {}

  @Get()
  getVinylPage(@Query() paginationOptions: PaginationOptions) {
    return this.vinylService.getVinylPaginationResults(paginationOptions);
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
    return this.vinylService.create(createVinylDto, file);
  }
}
