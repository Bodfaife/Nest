import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async createTransaction(userId: string, type: string, amount: number, reference?: string, metadata?: any) {
    if (!amount || amount <= 0) throw new BadRequestException('Amount must be positive');

    // idempotency by reference
    if (reference) {
      const existing = await this.txRepo.findOne({ where: { reference } });
      if (existing) return existing;
    } else {
      reference = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    return this.dataSource.transaction(async manager => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      // For withdraw ensure sufficient balance
      if (type === 'withdraw') {
        if ((user as any).balance === undefined) (user as any).balance = 0;
        if ((user as any).balance < amount) throw new BadRequestException('Insufficient balance');
        (user as any).balance = Number((user as any).balance) - amount;
      } else {
        // deposit or save/topup increases balance
        (user as any).balance = Number((user as any).balance || 0) + amount;
      }

      await manager.save(User, user);

      const tx = manager.create(Transaction, {
        userId: user.id,
        type,
        amount,
        reference,
        status: 'success',
        metadata: metadata || null,
      });

      return manager.save(tx);
    });
  }
}
