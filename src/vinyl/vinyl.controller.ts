import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Query,
  Param,
  ParseUUIDPipe,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { ParseImagePipe } from 'src/utils/parseImage.pipe';
import { CreateVinylDto, UpdateVinylDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationOptions } from './types/paginationOptions.type';
import { SearchOptions } from './types/searchOptions.type';

@Controller('vinyl')
export class VinylController {
  constructor(private readonly vinylService: VinylService) {}

  @Get()
  getVinylPage(@Query() paginationOptions: PaginationOptions) {
    return this.vinylService.getVinylPaginationResults<PaginationOptions>(
      paginationOptions,
    );
  }

  @Get('search')
  searchForVinyl(@Query() searchOptions: SearchOptions) {
    return this.vinylService.getVinylPaginationResults<SearchOptions>(
      searchOptions,
    );
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createVinyl(
    @UploadedFile(ParseImagePipe)
    file: Express.Multer.File | undefined,
    @Body() createVinylDto: CreateVinylDto,
  ) {
    return this.vinylService.createVinyl(createVinylDto, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateVinyl(
    @UploadedFile(ParseImagePipe)
    file: Express.Multer.File | undefined,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVinylDto: UpdateVinylDto,
  ) {
    return this.vinylService.updateVinylById(id, updateVinylDto, file);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteVinyl(@Param('id', ParseUUIDPipe) id: string) {
    return this.vinylService.deleteVinylById(id);
  }
}
