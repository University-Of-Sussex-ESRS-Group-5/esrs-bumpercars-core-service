import { IsNotEmpty, IsString } from 'class-validator';

export class JwtConfig {
  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @IsNotEmpty()
  expireTime: string;
}
