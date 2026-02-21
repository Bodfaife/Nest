import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private readonly config: ConfigService) {
    const key = this.config.get<string>('STRIPE_SECRET') || process.env.STRIPE_SECRET || '';
    this.stripe = new Stripe(key, { apiVersion: '2022-11-15' });
  }

  async createPaymentIntent(amount: number, currency = 'usd', metadata: Record<string, any> = {}) {
    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      metadata,
    });
    return intent;
  }

  // Verify and return the parsed Stripe event using webhook secret
  constructStripeEvent(rawBody: string, signature: string) {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET') || process.env.STRIPE_WEBHOOK_SECRET || '';
    if (!secret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    try {
      const event = this.stripe.webhooks.constructEvent(rawBody, signature, secret);
      return event;
    } catch (e) {
      this.logger.warn('Stripe webhook verification failed: ' + (e as Error).message);
      throw e;
    }
  }
}
