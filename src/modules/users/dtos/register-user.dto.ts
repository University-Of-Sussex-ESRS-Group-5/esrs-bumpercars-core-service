import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResult } from '../../common/classes/api-result';
import { UserDTO } from './user.dto';

export class RegisterUserReqDTO {
  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsStrongPassword()
  readonly password: string;
}

export class RegisterUserResDTO extends ApiResult<UserDTO> {
  @ApiProperty({ type: UserDTO })
  data: UserDTO;
}
