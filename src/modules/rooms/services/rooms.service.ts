import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { RoomUser } from '../entities/room-user.entity';
import { ApiError } from '@modules/common/classes/api-error';
import { ErrorCode } from '@modules/common/constants/errors';
import { CreateRoomDTO } from '../dto/create-room.dto';
import { JoinRoomDTO } from '../dto/join-room.dto';
import { ChangeCarColorDTO } from '../dto/change-color.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomUser)
    private roomUserRepository: Repository<RoomUser>,
  ) {}

  async getListRooms(query: any): Promise<Room[]> {
    const { limit = 10, offset = 0 } = query;
    try {
      return await this.roomRepository.find({
        take: limit,
        skip: offset,
      });
    } catch (error) {
      throw new ApiError(ErrorCode.ROOM_NOT_FOUND);
    }
  }

  async createRoom(createRoomDto: CreateRoomDTO): Promise<Room> {
    const newRoom = this.roomRepository.create({
      ...createRoomDto,
      code: this.generateRoomCode(), // Add this line to generate code
    });
    return this.roomRepository.save(newRoom);
  }

  private generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  async joinRoom(joinRoomDto: JoinRoomDTO): Promise<RoomUser> {
    let room;
    if (joinRoomDto.code) {
      room = await this.roomRepository.findOne({
        where: {
          code: joinRoomDto.code,
          status: 'WAITING',
        },
      });
    } else {
      // Attempt to find any public WAITING room if no code is provided
      room = await this.roomRepository.findOne({
        where: {
          type: 'PUBLIC',
          status: 'WAITING',
        },
        order: {
          createdAt: 'ASC', // Join the oldest waiting room
        },
      });
    }

    if (!room) {
      throw new ApiError(ErrorCode.ROOM_NOT_FOUND);
    }

    if (room.type === 'PRIVATE' && !joinRoomDto.code) {
      throw new ApiError(ErrorCode.ROOM_NOT_FOUND);
    }

    const roomUser = this.roomUserRepository.create({
      roomId: room.id,
      userId: joinRoomDto.userId,
      carColor: joinRoomDto.carColor,
    });
    await this.roomUserRepository.save(roomUser);

    return roomUser;
  }

  async changeCarColor(dto: ChangeCarColorDTO): Promise<RoomUser> {
    const roomUser = await this.roomUserRepository.findOne({
      where: {
        roomId: dto.roomId,
        userId: dto.userId,
      },
    });

    if (!roomUser) {
      throw new ApiError(ErrorCode.ROOM_NOT_FOUND);
    }

    roomUser.carColor = dto.carColor;
    await this.roomUserRepository.save(roomUser);
    return roomUser;
  }
}
