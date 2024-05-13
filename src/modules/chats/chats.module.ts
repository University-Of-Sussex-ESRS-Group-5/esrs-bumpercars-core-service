import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './services/chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatsGateway } from './chats.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
