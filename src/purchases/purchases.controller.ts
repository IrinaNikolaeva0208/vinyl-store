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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE } from 'src/utils/constants';

@ApiTags('Purchases')
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

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
  @Post('stripe_webhook')
  async webhook(@Body() event: Stripe.Event, @Res() response: Response) {
    await this.purchasesService.createPurchaseIfPaymentSucceded(event);
    response.sendStatus(HttpStatus.OK);
  }
}
