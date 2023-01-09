import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1673267705381 implements MigrationInterface {
  name = 'initial1673267705381';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "User" ("id" character varying NOT NULL DEFAULT '05db8773-d6d9-4947-9d79-d7ba486a4ff2', "name" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Customization" ("id" character varying NOT NULL DEFAULT 'fe44ca49-309e-4cbd-95c6-9a4ef0b6cbc0', "textColor" character varying NOT NULL, "backgroundColor" character varying NOT NULL, CONSTRAINT "PK_dd43b0686061c4249a429232577" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "Customization"`);
    await queryRunner.query(`DROP TABLE "User"`);
  }
}
