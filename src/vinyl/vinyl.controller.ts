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
import { ParseImagePipe } from '../utils/parseImage.pipe';
import {
  CreateVinylDto,
  UpdateVinylDto,
  SearchOptions,
  PaginationOptions,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminOnly, Public } from '../utils/decorators';
import { AdminOnlyGuard } from '../utils/guards';
import { Request } from 'express';
import { User } from 'src/users/entities';

@UseGuards(AdminOnlyGuard)
@Controller('vinyl')
export class VinylController {
  constructor(private readonly vinylService: VinylService) {}

  @Public()
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

  @AdminOnly()
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createVinyl(
    @UploadedFile(ParseImagePipe)
    file: Express.Multer.File | undefined,
    @Req() request: Request,
    @Body() createVinylDto: CreateVinylDto,
  ) {
    return this.vinylService.createVinyl(
      createVinylDto,
      file,
      (request.user as User).id,
    );
  }

  @AdminOnly()
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
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
      (request.user as User).id,
    );
  }

  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteVinyl(@Param('id', ParseUUIDPipe) id: string, @Req() request: Request) {
    return this.vinylService.deleteVinylById(id, (request.user as User).id);
  }
}
