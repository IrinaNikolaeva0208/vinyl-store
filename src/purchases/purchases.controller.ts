import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpStatus,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { PurchasesService } from './purchases.service';
import { Public } from 'src/utils/decorators';
import { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE } from 'src/utils/constants';

@ApiTags('Purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @ApiUnauthorizedResponse({ description: 'Authorization failed' })
  @ApiOkResponse({ description: 'Session was successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiNotFoundResponse({ description: 'Vinyl not found' })
  @ApiCookieAuth(ACCESS_TOKEN_COOKIE)
  @Post('/create-stripe-session')
  async buyVinyl(
    @Query('vinylId', ParseUUIDPipe) vinylId: string,
    @Req() request: Request,
  ) {
    const redirectUrl = await this.purchasesService.getCheckoutUrl(
      vinylId,
      request.user.id,
      request.user.email,
    );
    return { redirectUrl };
  }

  @Public()
  @Post('stripe-webhook')
  async webhook(@Body() event: Stripe.Event, @Res() response: Response) {
    await this.purchasesService.createPurchaseIfPaymentSucceded(event);
    response.sendStatus(HttpStatus.OK);
  }
}
