import { MigrationInterface, QueryRunner } from 'typeorm';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import {
  ADMIN_BIRTHDATE,
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME,
  NO_PHOTO_URL,
} from '../../utils/constants';
import { Role } from '../../auth/types';

dotenv.config();

export class FillDB1713604193427 implements MigrationInterface {
  name = 'FillDB1713604193427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const vinylIds: string[] = [];
    for (let i = 0; i < 50; i++) {
      const vinylId = faker.string.uuid();
      if (!(i % 5)) vinylIds.push(vinylId);
      await queryRunner.query(
        `INSERT INTO "vinyl" VALUES ('${vinylId}', '${faker.lorem.word()}', '${faker.lorem.sentences()}', '${faker.person.fullName()}', ${faker.number.float({ min: 0.05, max: 1000, fractionDigits: 2 })}, '${NO_PHOTO_URL}')`,
      );
    }

    const adminId = faker.string.uuid();
    await queryRunner.query(
      `INSERT INTO "user" VALUES ('${adminId}', '${ADMIN_FIRST_NAME}', '${ADMIN_LAST_NAME}', '${ADMIN_BIRTHDATE}', '${NO_PHOTO_URL}', '${process.env.GMAIL_EMAIL}', '${Role.ADMIN}')`,
    );

    for (let i = 0; i < vinylIds.length; i++) {
      await queryRunner.query(
        `INSERT INTO "purchase" VALUES ('${faker.string.uuid()}', '${adminId}', '${vinylIds[i]}', ${faker.date.between({ from: '2024-01-01', to: new Date() }).getTime()})`,
      );

      await queryRunner.query(
        `INSERT INTO "review" VALUES ('${faker.string.uuid()}', ${faker.number.int({ min: 1, max: 5 })}, '${faker.lorem.sentences()}', '${vinylIds[i]}', '${adminId}')`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "vinyl"');
    await queryRunner.query('DELETE FROM "purchase"');
    await queryRunner.query('DELETE FROM "log"');
    await queryRunner.query('DELETE FROM "review"');
    await queryRunner.query('DELETE FROM "user"');
  }
}
