import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1680000000000 implements MigrationInterface {
  name = 'CreateUsersTable1680000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "phone" character varying, "fullName" character varying, "password" character varying, "recoveryPhrase" text, "hashedRefreshToken" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_email" UNIQUE ("email"), CONSTRAINT "UQ_phone" UNIQUE ("phone"), CONSTRAINT "PK_id" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }

}
