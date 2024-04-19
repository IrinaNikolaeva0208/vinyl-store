import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StripeService } from 'src/purchases/stripe.service';
import { VinylService } from '../vinyl/vinyl.service';
import { Stripe } from 'stripe';
import { Purchase } from './entities/purchase.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,
    private readonly vinylService: VinylService,
    private readonly stripeService: StripeService,
    private readonly mailService: MailService,
  ) {}

  async getCheckoutUrl(vinylId: string, userId: string, email: string) {
    const vinyl = await this.vinylService.getVinylById(vinylId);
    const sessionUrl = await this.stripeService.createCheckoutSession(
      vinyl,
      userId,
      email,
    );
    return sessionUrl;
  }

  async createPurchaseIfPaymentSucceded(event: Stripe.Event) {
    if (event.type == 'checkout.session.completed') {
      const { userId, email, vinylId } = event.data.object['metadata'];
      const vinyl = await this.vinylService.getVinylById(vinylId);
      const newPurchase = this.purchasesRepository.create({
        vinylId,
        userId,
        createdAt: Date.now(),
      });

      await this.purchasesRepository.save(newPurchase);
      await this.mailService.sendPaymentSuccededNotification(email, vinyl);
    }
  }
}
