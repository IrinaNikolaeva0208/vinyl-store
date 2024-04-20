import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StripeService } from 'src/purchases/stripe.service';
import { VinylService } from '../vinyl/vinyl.service';
import { Stripe } from 'stripe';
import { Purchase } from './entities/purchase.entity';
import { MailService } from 'src/mail/mail.service';
import { Vinyl } from 'src/vinyl/entities';
import { LogsService } from 'src/operationsLogs/logs.service';
import { Entity, Operation } from 'src/utils/types';
import { CHECKOUT_SESSION_COMPLETED_EVENT_TYPE } from 'src/utils/constants';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,
    private readonly vinylService: VinylService,
    private readonly stripeService: StripeService,
    private readonly mailService: MailService,
    private readonly logsService: LogsService,
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
    if (event.type == CHECKOUT_SESSION_COMPLETED_EVENT_TYPE) {
      const { userId, email, vinylId } = event.data.object.metadata;
      const vinyl = await this.vinylService.getVinylById(vinylId);
      const newPurchase = this.purchasesRepository.create({
        vinylId,
        userId,
        createdAt: Date.now(),
      });

      const savedPurchase = await this.purchasesRepository.save(newPurchase);
      await this.logPurchaseOperation(
        userId,
        savedPurchase.id,
        Operation.CREATE,
      );
      await this.mailService.sendPaymentSuccededNotification(email, vinyl);
    }
  }

  async getPurchasesPageForUser(limit: number, offset: number, userId: string) {
    return await this.purchasesRepository
      .createQueryBuilder('purchase')
      .leftJoinAndMapOne(
        'purchase.vinyl',
        Vinyl,
        'vinyl',
        'purchase.vinylId = vinyl.id',
      )
      .select([
        'purchase.id',
        'purchase.createdAt',
        'vinyl.name',
        'vinyl.authorName',
        'vinyl.price',
      ])
      .take(limit)
      .skip(offset)
      .where({ userId })
      .getManyAndCount();
  }

  async logPurchaseOperation(
    userId: string,
    entityId: string,
    operation: Operation,
  ) {
    await this.logsService.createLog({
      performedByUser: userId,
      entity: Entity.VINYL,
      entityId,
      createdAt: Date.now(),
      operation,
    });
  }
}
