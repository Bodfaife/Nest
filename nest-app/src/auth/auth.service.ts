import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async validateUser(identifier: string, password: string) {
    const user = identifier.includes('@') ? await this.users.findByEmail(identifier) : await this.users.findByPhone(identifier);
    if (!user) return null;
    const valid = await this.users.validatePassword(user, password);
    if (!valid) return null;
    return user;
  }

  async login(user) {
    if (!user) throw new UnauthorizedException();
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwt.sign(payload, { secret: process.env.JWT_ACCESS_TOKEN_SECRET, expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m' });
    const refreshToken = this.jwt.sign({ sub: user.id }, { secret: process.env.JWT_REFRESH_TOKEN_SECRET, expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d' });

    // store hashed refresh token
    await this.users.setRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.users.removeRefreshToken(userId);
  }
}
