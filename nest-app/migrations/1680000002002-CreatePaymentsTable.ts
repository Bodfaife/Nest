import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsTable1680000002002 implements MigrationInterface {
  name = 'CreatePaymentsTable1680000002002'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "intentId" character varying NOT NULL, "userId" uuid, "amount" bigint NOT NULL, "currency" character varying DEFAULT 'usd', "metadata" json, "status" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_payments" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_user"`);
    await queryRunner.query(`DROP TABLE "payments"`);
  }

}
