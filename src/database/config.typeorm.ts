import 'reflect-metadata';
import configuration from '../config/configuration';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';

const { database } = configuration();

export const AppDataSource = new DataSource({
  type: database.type,
  host: database.host,
  port: parseInt(database.port, 10),
  username: database.username,
  database: database.dbName,
  password: database.password,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: __dirname + '/migrations/',
  },
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  synchronize: false,
  logging: true,
} as DataSourceOptions);
