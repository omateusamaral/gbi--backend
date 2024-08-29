import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1724896913330 implements MigrationInterface {
  name = 'Gen1724896913330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_3b9db4369d99f51b0594960d0cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_ffcd71ede6e120f650303d62353"`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" DROP CONSTRAINT "FK_6f3ab7775c640ab139b262df3eb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f5c864430d1f3626bc6671d6b8"`,
    );
    await queryRunner.query(`DROP TABLE "question"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_569e25b0ce8135a01b1ff9fb14"`,
    );
    await queryRunner.query(`DROP TABLE "response"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "response" ("responseId" character varying NOT NULL, "answer" character varying NOT NULL, "responseDate" TIMESTAMP NOT NULL DEFAULT now(), "surveySurveyId" character varying, "questionQuestionId" character varying, CONSTRAINT "PK_569e25b0ce8135a01b1ff9fb146" PRIMARY KEY ("responseId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_569e25b0ce8135a01b1ff9fb14" ON "response" ("responseId") `,
    );

    await queryRunner.query(
      `CREATE TABLE "question" ("questionId" character varying NOT NULL, "questionText" character varying NOT NULL, "responseType" character varying NOT NULL, "surveySurveyId" character varying, CONSTRAINT "PK_f5c864430d1f3626bc6671d6b8d" PRIMARY KEY ("questionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f5c864430d1f3626bc6671d6b8" ON "question" ("questionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_6f3ab7775c640ab139b262df3eb" FOREIGN KEY ("surveySurveyId") REFERENCES "survey"("surveyId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "response" ADD CONSTRAINT "FK_ffcd71ede6e120f650303d62353" FOREIGN KEY ("questionQuestionId") REFERENCES "question"("questionId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_3b9db4369d99f51b0594960d0cc" FOREIGN KEY ("surveySurveyId") REFERENCES "survey"("surveyId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
