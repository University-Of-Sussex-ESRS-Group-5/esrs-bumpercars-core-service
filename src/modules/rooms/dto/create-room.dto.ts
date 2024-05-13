import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDTO {
  @ApiProperty({
    description: 'The type of the room, either PUBLIC or PRIVATE',
    example: 'PUBLIC',
    enum: ['PUBLIC', 'PRIVATE'],
  })
  @IsEnum(['PUBLIC', 'PRIVATE'])
  type: string;

  @ApiProperty({
    description: 'UUID of the leader of the room',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  leaderId: string;
}
