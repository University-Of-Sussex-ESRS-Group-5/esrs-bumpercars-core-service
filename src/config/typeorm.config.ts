import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { Config } from './types';
import { DatabaseConfig } from './types/database';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService<Config, true>,
  ): Promise<TypeOrmModuleOptions> => {
    const database = configService.get<DatabaseConfig>('database');

    return {
      type: database.type,
      host: database.host,
      port: parseInt(database.port, 10),
      username: database.username,
      database: database.dbName,
      password: database.password,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      migrationsRun: true,
      extra: {
        max: 30,
        charset: 'utf8mb4_unicode_ci',
      },
      synchronize: false,
      logging: false,
      poolSize: 20,
    } as DataSourceOptions;
  },
};
