import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, FindOptionsOrderValue } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import { FetchChatDto } from '../dtos/chats.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async getChatHistory(fetchChatDto: FetchChatDto): Promise<Chat[]> {
    const queryOptions: {
      where: { roomId?: string; chatType?: string };
      order: { createdAt: FindOptionsOrderValue | undefined };
    } = {
      where: {},
      order: { createdAt: 'ASC' },
    };

    if (fetchChatDto.roomId) {
      queryOptions.where.roomId = fetchChatDto.roomId;
    } else {
      queryOptions.where.chatType = 'LOBBY'; // Assuming 'LOBBY' is the type for public chats
    }

    return this.chatRepository.find(queryOptions);
  }
}
