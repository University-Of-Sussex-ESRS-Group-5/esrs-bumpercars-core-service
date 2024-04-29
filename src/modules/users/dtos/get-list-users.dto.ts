import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResult } from '../../common/classes/api-result';
import { UserDTO } from './user.dto';

export class GetListUsersReqDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly offset?: number;
}

export class GetListUsersResDTO extends ApiResult<UserDTO> {
  @ApiProperty({ type: UserDTO })
  data: UserDTO;
}
