import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(userData: Partial<User>) {
    const user = this.repo.create(userData);
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 12);
    }
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    if (!email) return null;
    return this.repo.findOneBy({ email });
  }

  async findByPhone(phone: string) {
    if (!phone) return null;
    return this.repo.findOneBy({ phone });
  }

  async findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  async setRefreshToken(userId: string, refreshToken: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException();
    user.hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    await this.repo.save(user);
  }

  async removeRefreshToken(userId: string) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException();
    user.hashedRefreshToken = null;
    await this.repo.save(user);
  }

  async validatePassword(user: User, plain: string) {
    if (!user || !user.password) return false;
    return bcrypt.compare(plain, user.password);
  }
}
