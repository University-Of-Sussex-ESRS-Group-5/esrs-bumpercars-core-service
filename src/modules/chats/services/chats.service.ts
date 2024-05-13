import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, EntityManager, FindOptionsOrderValue } from 'typeorm';
import {Chat} from '../entities/chat.entity';
import {Room} from '@modules/rooms/entities/room.entity';
import { FetchChatDto } from '../dtos/chats.dto';

@Injectable()
export class ChatsService {
    constructor(@InjectRepository(Chat)
                private chatRepository: Repository<Chat>,
                @InjectRepository(Room)
                private roomRepository: Repository<Room>,) {
    }


    async getChatHistory(fetchChatDto: FetchChatDto): Promise<Chat[]> {
        const queryOptions: {
            where: { roomId?: string; chatType?: string };
            order: { createdAt: FindOptionsOrderValue | undefined };
        } = {
            where: {},
            order: {createdAt: 'ASC'},
        };

        if (fetchChatDto.roomId) {
            queryOptions.where.roomId = fetchChatDto.roomId;
        } else {
            queryOptions.where.chatType = 'LOBBY'; // Assuming 'LOBBY' is the type for public chats
        }

        return this.chatRepository.find(queryOptions);
    }

    async getAllLobby(userId: string) {
        return await this.chatRepository.find({
            where: {
                chatType: 'LOBBY',
                userId: userId,
            },
        });
    }

    async getAllRooms(userId: string) {
        const rooms = await this.chatRepository.find({
            where: {
                chatType: 'ROOM',
                userId: userId,
            },
            select: {
                roomId: true,
            },
        });
        return rooms;
    }

    async createRoom(userId: string, roomId: string) {
        const room = await this.roomRepository.findOne({
            where: {
                id: roomId,
                leaderId: userId,
            },
        });

        if (!room) {
            throw new HttpException(
                'Room not found for current user',
                HttpStatus.CONFLICT,
            );
        }

        return await this.chatRepository.save({
            chatType: 'ROOM',
            message: 'Room Created',
            roomId: room['id'],
            userId: userId,
        });
    }

    async createLobby(userId: string, roomId: string) {
        const room = await this.roomRepository.findOne({
            where: {
                id: roomId,
                leaderId: userId,
            },
        });

        if (!room) {
            throw new HttpException(
                'Room not found for current user',
                HttpStatus.CONFLICT,
            );
        }

        return await this.chatRepository.save({
            chatType: 'LOBBY',
            message: 'Lobby Created',
            roomId: room['id'],
            userId: userId,
        });
    }

    async getMessages(roomId: string, chatType: 'LOBBY' | 'ROOM') {
        return await this.chatRepository.find({
            where: {
                chatType: chatType,
                roomId: roomId,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    async createMessage(roomId: string,
                        userId: string,
                        message: string,
                        chatType: 'LOBBY' | 'ROOM',) {
        return await this.chatRepository.save({
            chatType: chatType,
            roomId: roomId,
            message: message,
            userId: userId,
        });
    }
}
