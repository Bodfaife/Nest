import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req) {
    const id = req.user?.sub;
    return this.users.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.users.findById(id);
  }
}
