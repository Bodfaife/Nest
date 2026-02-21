import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdempotencyKey } from './idempotency.entity';

@Injectable()
export class IdempotencyService {
  constructor(
    @InjectRepository(IdempotencyKey)
    private readonly repo: Repository<IdempotencyKey>,
  ) {}

  async getByKey(key: string) {
    if (!key) return null;
    return this.repo.findOne({ where: { key } });
  }

  async createPending(key: string) {
    const existing = await this.getByKey(key);
    if (existing) return existing;
    const rec = this.repo.create({ key, status: 'pending' });
    return this.repo.save(rec);
  }

  async finalize(key: string, response: any) {
    const rec = await this.getByKey(key);
    if (!rec) return null;
    rec.status = 'done';
    rec.response = response;
    return this.repo.save(rec);
  }
}
