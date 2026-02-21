import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export type TransactionType = 'deposit' | 'withdraw' | 'save' | 'topup';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'varchar' })
  type: TransactionType;

  @Column({ type: 'double precision' })
  amount: number;

  @Column({ unique: true })
  reference: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: 'pending' | 'success' | 'failed';

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;
}
