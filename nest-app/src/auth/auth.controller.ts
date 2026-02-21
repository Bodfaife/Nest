import { Controller, Post, Body, BadRequestException, Req, UseGuards, Res, UnauthorizedException } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

class LoginDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private users: UsersService, private jwt: JwtService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { email, phone, password, fullName } = body;
    if (!password || (!email && !phone)) throw new BadRequestException('Missing required fields');
    const created = await this.users.create({ email, phone, password, fullName });
    // do not return password/refresh token
    const { password: _p, hashedRefreshToken, ...safe } = created as any;
    return { ok: true, user: safe };
  }

  
  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: any) {
    const identifier = body.identifier;
    const user = await this.auth.validateUser(identifier, body.password);
    if (!user) throw new BadRequestException('Invalid credentials');
    const tokens = await this.auth.login(user);

    // Set refresh token as httpOnly secure cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    return { accessToken: tokens.accessToken };
  }

  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const rt = req.cookies?.refreshToken;
    if (!rt) throw new UnauthorizedException();
    let payload: any = null;
    try {
      payload = this.jwt.verify(rt, { secret: process.env.JWT_REFRESH_TOKEN_SECRET });
    } catch (e) {
      throw new UnauthorizedException();
    }
    const user = await this.users.findById(payload.sub);
    if (!user || !user.hashedRefreshToken) throw new UnauthorizedException();
    const matches = await bcrypt.compare(rt, user.hashedRefreshToken);
    if (!matches) throw new UnauthorizedException();

    const accessToken = this.jwt.sign({ sub: user.id, email: user.email }, { secret: process.env.JWT_ACCESS_TOKEN_SECRET, expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '15m' });
    return { accessToken };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const id = req.user?.sub;
    await this.auth.logout(id);
    res.clearCookie('refreshToken');
    return { ok: true };
  }
}
