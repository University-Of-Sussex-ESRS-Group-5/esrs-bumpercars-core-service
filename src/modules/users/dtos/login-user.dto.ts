import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResult } from '../../common/classes/api-result';
import { UserDTO } from './user.dto';

export class LoginUserWithEmailReqDTO {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsStrongPassword()
  readonly password: string;
}

export class LoginUserWithUsernameReqDTO {
  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsStrongPassword()
  readonly password: string;
}

export class LoginUserResDTO extends ApiResult<UserDTO> {
  @ApiProperty({ type: UserDTO })
  data: UserDTO;
}
