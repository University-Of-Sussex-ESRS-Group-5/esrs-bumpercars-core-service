import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RedisConfig {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  @IsNotEmpty()
  port: number;
}
