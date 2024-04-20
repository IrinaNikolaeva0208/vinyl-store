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
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { VinylService } from './vinyl.service';
import { ParseImagePipe } from '../utils/pipes';
import { CreateVinylDto, UpdateVinylDto, SearchOptions } from './dto';
import { VinylPaginationOptions } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminOnly, Public } from '../utils/decorators';
import { AdminOnlyGuard } from '../utils/guards';
import { Request } from 'express';
import { IMAGE_FIELD } from 'src/utils/constants';

@UseGuards(AdminOnlyGuard)
@Controller('vinyl')
export class VinylController {
  constructor(private readonly vinylService: VinylService) {}

  @Public()
  @Get()
  getVinylPage(@Query() paginationOptions: VinylPaginationOptions) {
    return this.vinylService.getVinylPaginationResults<VinylPaginationOptions>(
      paginationOptions,
    );
  }

  @Get('search')
  searchForVinyl(@Query() searchOptions: SearchOptions) {
    return this.vinylService.getVinylPaginationResults<SearchOptions>(
      searchOptions,
    );
  }

  @AdminOnly()
  @Post()
  @UseInterceptors(FileInterceptor(IMAGE_FIELD))
  async createVinyl(
    @UploadedFile(ParseImagePipe)
    file: Express.Multer.File | undefined,
    @Req() request: Request,
    @Body() createVinylDto: CreateVinylDto,
  ) {
    return this.vinylService.createVinyl(createVinylDto, file, request.user.id);
  }

  @AdminOnly()
  @Patch(':id')
  @UseInterceptors(FileInterceptor(IMAGE_FIELD))
  updateVinyl(
    @UploadedFile(ParseImagePipe)
    file: Express.Multer.File | undefined,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVinylDto: UpdateVinylDto,
    @Req() request: Request,
  ) {
    return this.vinylService.updateVinylById(
      id,
      updateVinylDto,
      file,
      request.user.id,
    );
  }

  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteVinyl(@Param('id', ParseUUIDPipe) id: string, @Req() request: Request) {
    return this.vinylService.deleteVinylById(id, request.user.id);
  }
}
