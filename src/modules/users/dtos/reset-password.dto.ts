import { IsString } from 'class-validator';

export class ResetPasswordReqDTO {
  @IsString()
  readonly token: string;

  @IsString()
  readonly newPassword: string;
}