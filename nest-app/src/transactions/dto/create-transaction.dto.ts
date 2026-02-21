import { IsNumber, IsPositive, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsIn(['deposit', 'withdraw', 'save', 'topup'])
  type: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  metadata?: any;
}
