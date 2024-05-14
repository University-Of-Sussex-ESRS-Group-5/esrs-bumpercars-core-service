import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateScoreDTO {
  @ApiProperty({ type: Number })
  @IsInt()
  score: number;
}
