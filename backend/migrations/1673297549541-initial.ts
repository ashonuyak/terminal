import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1673297549541 implements MigrationInterface {
    name = 'initial1673297549541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" character varying NOT NULL DEFAULT '607a8686-49e8-4077-a745-8782bc93d45e', "name" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, "customizationId" character varying, CONSTRAINT "UQ_99f220333df04d5f74f6db26c07" UNIQUE ("name"), CONSTRAINT "REL_7519e75624b65038db8f4c6b23" UNIQUE ("customizationId"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Customization" ("id" character varying NOT NULL DEFAULT 'bea8b58d-d683-41e9-8231-1c96381a8ddd', "textColor" character varying NOT NULL, "backgroundColor" character varying NOT NULL, CONSTRAINT "PK_dd43b0686061c4249a429232577" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "FK_7519e75624b65038db8f4c6b237" FOREIGN KEY ("customizationId") REFERENCES "Customization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "FK_7519e75624b65038db8f4c6b237"`);
        await queryRunner.query(`DROP TABLE "Customization"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
