import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Room } from '../entities/room.entity';
import { RoomUser } from '../entities/room-user.entity';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,
        @InjectRepository(RoomUser)
        private roomUserRepository: Repository<RoomUser>,
    ) { }
}