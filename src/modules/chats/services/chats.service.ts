import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Chat } from '../entities/chat.entity';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
    ) { }
}