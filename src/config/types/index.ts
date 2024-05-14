import { ValidateNested, IsEnum, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { DatabaseConfig } from './database';
import { RedisConfig } from './redis';
import { AwsConfig } from './aws';
import { WebsocketConfig } from './websocket';
import { JwtConfig } from './jwt';

export enum AppEnv {
  Local = 'local',
  Staging = 'staging',
  Production = 'production',
}

export * from './redis';
export * from './aws';
export * from './websocket';

export class Config {
  @IsEnum(AppEnv)
  @IsNotEmpty()
  @Expose({ name: 'app_env' })
  appEnv: string;

  @ValidateNested()
  @IsNotEmpty()
  database: DatabaseConfig;

  @IsNotEmpty()
  @ValidateNested()
  redis: RedisConfig;

  @IsNotEmpty()
  @ValidateNested()
  websocketConfig: WebsocketConfig;

  @ValidateNested()
  @IsNotEmpty()
  aws: AwsConfig;

  @ValidateNested()
  @IsNotEmpty()
  jwt: JwtConfig;
}
