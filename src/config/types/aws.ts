import { IsNotEmpty, IsString } from 'class-validator';

export class AwsConfig {
  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  accessKeyId: string;

  @IsString()
  @IsNotEmpty()
  secretAccessKey: string;
}
