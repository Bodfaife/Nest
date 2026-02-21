import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('idempotency_keys')
export class IdempotencyKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'json', nullable: true })
  response: any;

  @CreateDateColumn()
  createdAt: Date;
}
