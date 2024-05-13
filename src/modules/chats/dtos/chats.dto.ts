import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FetchChatDto {
  @ApiPropertyOptional({
    description:
      'ID of the room for which to fetch the chat history, leave empty for public lobby chats',
    example: 'abcde12345-6789-0123-4567-89abcdef0123',
  })
  @IsOptional()
  @IsString()
  roomId?: string;
}
