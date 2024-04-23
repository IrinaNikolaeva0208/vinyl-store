import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1713600184628 implements MigrationInterface {
  name = 'Init1713600184628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "score" integer NOT NULL, "comment" text NOT NULL, "vinylId" uuid NOT NULL, "authorId" uuid NOT NULL, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" text NOT NULL, "lastName" text NOT NULL, "birthdate" date, "avatar" text NOT NULL, "email" text NOT NULL, "role" "public"."user_role_enum" NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "purchase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "vinylId" uuid NOT NULL, "createdAt" bigint NOT NULL, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vinyl" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "authorName" text NOT NULL, "price" double precision NOT NULL, "image" text NOT NULL, CONSTRAINT "PK_a35da8699c1edabf461555e8737" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "operation" "public"."log_operation_enum" NOT NULL, "entity" "public"."log_entity_enum" NOT NULL, "entityId" uuid NOT NULL, "createdAt" bigint NOT NULL, "performedByUser" uuid NOT NULL, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_1e758e3895b930ccf269f30c415" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_01a98f7acabc7f7ba6d9025bb85" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" ADD CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" ADD CONSTRAINT "FK_7ed1f0196bc7d0a2701b8ac9d75" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchase" DROP CONSTRAINT "FK_7ed1f0196bc7d0a2701b8ac9d75"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchase" DROP CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_01a98f7acabc7f7ba6d9025bb85"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_1e758e3895b930ccf269f30c415"`,
    );
    await queryRunner.query(`DROP TABLE "log"`);
    await queryRunner.query(`DROP TABLE "vinyl"`);
    await queryRunner.query(`DROP TABLE "purchase"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "review"`);
  }
}
