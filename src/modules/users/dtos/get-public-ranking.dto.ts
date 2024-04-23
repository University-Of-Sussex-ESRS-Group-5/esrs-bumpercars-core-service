import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResult } from '../../common/classes/api-result';

export class PublicRankingDTO {
  @ApiProperty()
  @IsString()
  readonly id: string;

  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsString()
  readonly points: string;
}

export class GetPublicRankingResDTO extends ApiResult<PublicRankingDTO> {
  @ApiProperty({ type: PublicRankingDTO })
  data: PublicRankingDTO;
}
