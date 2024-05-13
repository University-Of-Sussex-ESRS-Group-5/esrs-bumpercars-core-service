import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseFailModel } from '../common/model/api-result.model';
import { ChatsService } from './services/chats.service';
import { ApiResult } from '../common/classes/api-result';
import { Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { FetchChatDto } from './dtos/chats.dto';
import { Chat } from './entities/chat.entity';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('history')
  @ApiOperation({
    summary: 'Fetch chat history for a specific room or the public lobby',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved chat history',
    type: Chat,
    isArray: true,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getChatHistory(@Query() fetchChatDto: FetchChatDto): Promise<Chat[]> {
    return this.chatsService.getChatHistory(fetchChatDto);
  }
}
