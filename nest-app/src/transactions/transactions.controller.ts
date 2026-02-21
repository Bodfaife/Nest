import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly txService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Req() req: any, @Body() body: CreateTransactionDto) {
    const userId = req.user?.sub || req.user?.id;
    const tx = await this.txService.createTransaction(userId, body.type, body.amount, body.reference, body.metadata);
    return { ok: true, transaction: tx };
  }
}
