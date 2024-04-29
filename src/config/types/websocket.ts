import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WebsocketConfig {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  @IsNotEmpty()
  port: number;

  // @IsString()
  // @IsNotEmpty()
  // password: string;

  // @IsString()
  // @IsNotEmpty()
  // username: string;
}
