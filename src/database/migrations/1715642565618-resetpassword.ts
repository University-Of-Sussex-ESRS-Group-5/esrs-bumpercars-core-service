import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Resetpassword1715642565618 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "reset_password",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "user_id",
                    type: "int",
                },
                {
                    name: "token",
                    type: "varchar",
                },
                {
                    name: "expires_at",
                    type: "timestamp",
                },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("reset_password");
    }

}
