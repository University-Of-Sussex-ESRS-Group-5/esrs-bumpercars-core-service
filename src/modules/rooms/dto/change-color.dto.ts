import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeCarColorDTO {
  @ApiProperty({
    description: 'ID of the room',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  roomId: string;

  @ApiProperty({
    description: 'ID of the user whose car color is to be changed',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'New car color',
    example: 'Blue',
  })
  @IsString()
  carColor: string;
}
