import { MigrationInterface, QueryRunner } from "typeorm";

export class Gen1724983339244 implements MigrationInterface {
    name = 'Gen1724983339244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "starRating"`);
        await queryRunner.query(`ALTER TABLE "survey" DROP COLUMN "contactEmail"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "survey" ADD "contactEmail" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "survey" ADD "starRating" integer NOT NULL`);
    }

}
