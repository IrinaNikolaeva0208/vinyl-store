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
import { User } from 'src/users/entities';
import { StripeService } from './stripe.service';

@Controller('purchases')
export class PurchasesController {
  constructor(
    private readonly purchasesService: PurchasesService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('/create-stripe-session')
  async buyVinyl(
    @Query('vinylId', ParseUUIDPipe) vinylId: string,
    @Req() request: Request,
  ) {
    const redirectUrl = await this.purchasesService.getCheckoutUrl(
      vinylId,
      (request.user as User).id,
      (request.user as User).email,
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
