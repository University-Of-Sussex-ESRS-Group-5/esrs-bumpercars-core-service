import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { DatabaseType } from 'typeorm';

export class DatabaseConfig {
  @IsNotEmpty()
  type: DatabaseType;

  @IsNotEmpty()
  host: string;

  @IsNotEmpty()
  port: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Expose({ name: 'db_name' })
  dbName: string;
}
