import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToRoomUser1708513775203 implements MigrationInterface {
  name = 'AddStatusToRoomUser1708513775203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ENUM type for status
    await queryRunner.query(
      `CREATE TYPE "room_user_status_enum" AS ENUM('READY', 'WAITING')`,
    );

    // Add the status column with a default value of 'WAITING'
    await queryRunner.query(
      `ALTER TABLE "room_user" ADD "status" "room_user_status_enum" NOT NULL DEFAULT 'WAITING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the status column
    await queryRunner.query(`ALTER TABLE "room_user" DROP COLUMN "status"`);

    // Drop the ENUM type
    await queryRunner.query(`DROP TYPE "room_user_status_enum"`);
  }
}
