import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreategameDTO {
  @ApiProperty({ type: String })
  @IsString()
  roomId: string;
}
