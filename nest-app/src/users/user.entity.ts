import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  recoveryPhrase: string;

  @Column({ type: 'text', nullable: true })
  hashedRefreshToken: string;

  @Column({ type: 'double precision', default: 0 })
  balance: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
