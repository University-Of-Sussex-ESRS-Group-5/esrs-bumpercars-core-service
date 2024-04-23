import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResult } from '../../common/classes/api-result';

export class GameRankingDTO {
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

export class GetGameRankingReqDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly offset: string;
}

export class GetGameRankingResDTO extends ApiResult<GameRankingDTO> {
  @ApiProperty({ type: GameRankingDTO })
  data: GameRankingDTO;
}
