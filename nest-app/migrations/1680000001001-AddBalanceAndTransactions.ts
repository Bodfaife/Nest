import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBalanceAndTransactions1680000001001 implements MigrationInterface {
  name = 'AddBalanceAndTransactions1680000001001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "balance" double precision DEFAULT 0`);
    await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "type" character varying NOT NULL, "amount" double precision NOT NULL, "reference" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "metadata" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_reference" UNIQUE ("reference"), CONSTRAINT "PK_tx" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_user"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "balance"`);
  }

}
