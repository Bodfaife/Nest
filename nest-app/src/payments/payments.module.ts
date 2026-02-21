import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { IdempotencyModule } from '../idempotency/idempotency.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { PaymentsService } from './payments.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './payment.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([PaymentEntity]), IdempotencyModule, TransactionsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
