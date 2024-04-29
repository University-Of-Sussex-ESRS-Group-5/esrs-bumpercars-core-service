import { ApiProperty } from '@nestjs/swagger';
import { ApiResult } from '../../common/classes/api-result';

export class JwtResponse {
  readonly access_token: string;
}

export class LoginSuccessResp extends ApiResult<JwtResponse> {
  @ApiProperty({ type: JwtResponse })
  data: JwtResponse;
}
