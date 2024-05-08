import { IsEmail } from 'class-validator';

export class ForgetPasswordReqDTO {
  @IsEmail()
  readonly email: string;
}