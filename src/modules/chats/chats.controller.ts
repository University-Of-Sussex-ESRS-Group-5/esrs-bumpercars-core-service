import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatsService } from './services/chats.service';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
}
