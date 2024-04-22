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
import {
  CreateVinylDto,
  UpdateVinylDto,
  SearchOptions,
  ReviewsPaginationOptions,
  CreateReviewDto,
} from './dto';
import { VinylPaginationOptions } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminOnly, Public } from '../utils/decorators';
import { AdminOnlyGuard } from '../utils/guards';
import { Request } from 'express';
import { ACCESS_TOKEN_COOKIE, IMAGE_FIELD } from 'src/utils/constants';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Vinyl } from './entities';
import {
  VinylSearchResults,
  VinylPaginationResults,
  ReviewPaginationResults,
} from './responses';
import { Review } from 'src/reviews/entities';

@ApiTags('Vinyl')
@UseGuards(AdminOnlyGuard)
@Controller('vinyl')
export class VinylController {
  constructor(private readonly vinylService: VinylService) {}

  @ApiOkResponse({
    description: 'Recieved vinyl records page',
    type: VinylPaginationResults,
  })
  @ApiBadRequestResponse({ description: 'Invalid query params' })
  @Public()
  @Get()
  getVinylPage(@Query() paginationOptions: VinylPaginationOptions) {
    return this.vinylService.getVinylPaginationResults<VinylPaginationOptions>(
      paginationOptions,
    );
  }

  @ApiOkResponse({
    description: 'Recieved vinyl records page',
    type: VinylSearchResults,
  })
  @ApiBadRequestResponse({ description: 'Invalid query params' })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @Get('search')
  searchForVinyl(@Query() searchOptions: SearchOptions) {
    return this.vinylService.getVinylPaginationResults<SearchOptions>(
      searchOptions,
    );
  }

  @ApiCreatedResponse({
    description: 'Vinyl record was successfully created',
    type: Vinyl,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @ApiConsumes('multipart/form-data')
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
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

  @ApiOkResponse({
    description: 'Recieved vinyl reviews',
    type: ReviewPaginationResults,
  })
  @ApiBadRequestResponse({ description: 'Invalid query params' })
  @ApiNotFoundResponse({ description: 'Vinyl not found' })
  @Public()
  @Get(':id/reviews')
  getVinylReviews(
    @Param('id', ParseUUIDPipe) vinylId: string,
    @Query() paginationOptions: ReviewsPaginationOptions,
  ) {
    return this.vinylService.getVinylReviews(vinylId, paginationOptions);
  }

  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiCreatedResponse({ description: 'Review was created', type: Review })
  @ApiConflictResponse({ description: 'Review already exists' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiNotFoundResponse({ description: 'Vinyl not found' })
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @Post(':id/reviews')
  postVinylReview(
    @Param('id', ParseUUIDPipe) vinylId: string,
    @Req() requset: Request,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.vinylService.createReviewOnVinyl(
      requset.user.id,
      vinylId,
      createReviewDto,
    );
  }

  @ApiOkResponse({
    description: 'Vinyl record was successfully updated',
    type: Vinyl,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @ApiNotFoundResponse({ description: 'Vinyl not found' })
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @ApiConsumes('multipart/form-data')
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

  @ApiNoContentResponse({
    description: 'Vinyl record was successfully deleted',
  })
  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @ApiNotFoundResponse({ description: 'Vinyl not found' })
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteVinyl(@Param('id', ParseUUIDPipe) id: string, @Req() request: Request) {
    return this.vinylService.deleteVinylById(id, request.user.id);
  }
}
