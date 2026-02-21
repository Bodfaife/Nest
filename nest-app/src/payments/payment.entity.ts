import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('payments')
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  intentId: string;

  @Column({ nullable: true })
  userId: string;

  @Column('bigint')
  amount: number;

  @Column({ default: 'usd' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
