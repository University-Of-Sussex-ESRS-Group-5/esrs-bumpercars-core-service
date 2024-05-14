import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StartGameDTO {
  @ApiProperty({ type: String })
  @IsString()
  gameId: string;
}
