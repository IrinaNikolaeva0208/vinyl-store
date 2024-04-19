import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AUTH_REDIRECT_ROUTE } from 'src/utils/constants';
import { Vinyl } from 'src/vinyl/entities';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-04-10',
    });
  }

  async createCheckoutSession(vinyl: Vinyl, userId: string, email: string) {
    const { id: priceId } = await this.getPrice(vinyl);
    const redirectUrl =
      this.configService.get<string>('DOMAIN') + AUTH_REDIRECT_ROUTE;

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      payment_method_types: ['card'],
      metadata: { userId, email, vinylId: vinyl.id },
      mode: 'payment',
      success_url: redirectUrl,
      cancel_url: redirectUrl,
    });

    return session.url;
  }

  async getPrice({ name, description, price }: Vinyl) {
    const product = await this.stripe.products.create({ name, description });
    return await this.stripe.prices.create({
      product: product.id,
      unit_amount: +(price * 100).toFixed(2),
      currency: this.configService.get<string>('STRIPE_CURRENCY'),
    });
  }
}
