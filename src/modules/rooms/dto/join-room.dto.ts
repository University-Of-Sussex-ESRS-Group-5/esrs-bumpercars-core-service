import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class JoinRoomDTO {
  @ApiPropertyOptional({
    description: 'Code of the room to join, required for private rooms',
    example: 'ROOM2024',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'User ID of the participant',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Color of the car selected by the user',
    example: 'Red',
  })
  @IsString()
  carColor: string;
}
