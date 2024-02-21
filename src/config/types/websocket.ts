import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WebsocketConfig {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNumber()
  @IsNotEmpty()
  port: number;
}
