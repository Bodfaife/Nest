import { Controller, Post, Req, Body, Headers, HttpCode, UnauthorizedException, UseGuards } from '@nestjs/common';
import { IdempotencyService } from '../idempotency/idempotency.service';
import { TransactionsService } from '../transactions/transactions.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from './payment.entity';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly idemp: IdempotencyService,
    private readonly txService: TransactionsService,
    private readonly config: ConfigService,
    private readonly paymentsService: PaymentsService,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
  ) {}

  // Simple webhook endpoint that demonstrates idempotency handling.
  @Post('webhook')
  @HttpCode(200)
  async webhook(@Req() req: any, @Body() body: any, @Headers('idempotency-key') idempotencyKey: string, @Headers('x-gateway-signature') signatureHeader: string, @Headers('stripe-signature') stripeSignature: string) {
    if (!idempotencyKey) idempotencyKey = body?.idempotencyKey || null;

    // Verify signature if a secret is configured. This uses HMAC-SHA256 over the JSON body.
    const secret = this.config.get<string>('PAYMENT_WEBHOOK_SECRET') || process.env.PAYMENT_WEBHOOK_SECRET || 'dev-webhook-secret';

    // If Stripe signature header is present, prefer Stripe verification using raw body
    if (stripeSignature) {
      try {
        const raw = req.rawBody || JSON.stringify(body || {});
        const event = this.paymentsService.constructStripeEvent(raw, stripeSignature);
        // normalize to previous body format for processing
        body = { type: event.type, data: event.data?.object };
      } catch (e) {
        throw new UnauthorizedException('Invalid stripe signature');
      }
    } else if (secret) {
      if (!signatureHeader) throw new UnauthorizedException('Missing signature');
      const payload = JSON.stringify(body || {});
      const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      try {
        const a = Buffer.from(expected, 'utf8');
        const b = Buffer.from(signatureHeader, 'utf8');
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
          throw new UnauthorizedException('Invalid signature');
        }
      } catch (e) {
        throw new UnauthorizedException('Invalid signature');
      }
    }

    if (idempotencyKey) {
      const existing = await this.idemp.getByKey(idempotencyKey);
      if (existing && existing.status === 'done') {
        return existing.response || { ok: true };
      }
      await this.idemp.createPending(idempotencyKey);
    }

    // Example: handle payment succeeded events
    try {
      // Handle generic gateway event type
      if (body && (body.type === 'payment.succeeded' || body.type === 'payment_intent.succeeded')) {
        const data = body.data || {};
        const userId = data.userId || body.userId || data.metadata?.userId || data.metadata?.user_id || null;
        const amount = Number(data.amount || body.amount || data.amount_received || 0);
        const reference = data.reference || data.id || `gw-${Date.now()}`;
        // save payment mapping for reconciliation
        try {
          await this.paymentRepo.save({ intentId: data.id || reference, userId: userId, amount, currency: data.currency || 'usd', metadata: data, status: 'succeeded' });
        } catch (e) {}

        const tx = await this.txService.createTransaction(userId, 'deposit', amount, reference, { source: 'gateway', raw: data });
        const resp = { ok: true, txId: tx.id };
        if (idempotencyKey) await this.idemp.finalize(idempotencyKey, resp);
        return resp;
      }

      const resp = { ok: true, received: true };
      if (idempotencyKey) await this.idemp.finalize(idempotencyKey, resp);
      return resp;
    } catch (e) {
      // Do not finalize idempotency on error so retries can proceed
      throw e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-intent')
  async createIntent(@Req() req: any, @Body() body: { amount: number; currency?: string; metadata?: any }) {
    const userId = req.user?.id || (body.metadata && body.metadata.userId) || null;
    const amount = Number(body.amount || 0);
    const currency = body.currency || 'usd';
    if (!amount || amount <= 0) return { error: 'invalid_amount' };

    const intent = await this.paymentsService.createPaymentIntent(amount, currency, body.metadata || {});

    try {
      await this.paymentRepo.save({ intentId: intent.id, userId, amount, currency, metadata: body.metadata || {}, status: intent.status });
    } catch (e) {}

    return { clientSecret: intent.client_secret, id: intent.id };
  }
}

