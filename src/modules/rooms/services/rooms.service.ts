import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { RoomUser } from '../entities/room-user.entity';
import { IRoomStatus, IRoomType } from '../typings/room.type';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomUser)
    private roomUserRepository: Repository<RoomUser>,
  ) {}

  async createRoom(
    code: string,
    type: IRoomType,
    status: IRoomStatus,
    leaderID: string,
  ) {
    const roomExisted = await this.roomRepository.findOne({
      where: {
        code: code,
      },
    });
    if (roomExisted) {
      return new ConflictException(
        'Room with Code {' + code + '}, Already exists.',
      );
    }

    return await this.roomRepository.save({
      code: code,
      type: type,
      status: status,
      leaderId: leaderID,
    });
  }

  async getAllRooms() {
    const rooms = await this.roomRepository.findAndCount();
    return {
      rooms: rooms[0],
      count: rooms[1],
    };
  }

  async getRoomByID(id: string) {
    return await this.roomRepository.findOne({
      relations: ['leader'],
      where: {
        id: id,
      },
    });
  }

  async checkIfRoomExists(roomId: any) {
    const roomExisted = await this.roomRepository.findOne({
      where: {
        id: roomId,
      },
    });
    if (roomExisted) return { status: true, data: roomExisted };
    else return { status: false, data: null };
  }

  async checkIfUserFoundInRoom(roomId: any, userId: any) {
    const userExisted = await this.roomUserRepository.findOne({
      where: {
        roomId: roomId,
        userId: userId,
      },
    });
    if (userExisted) return { status: true, data: userExisted };
    else return { status: false, data: null };
  }

  async joinRoom(roomId: string, userId: string, carColor: string) {
    const { status: roomStatus } = await this.checkIfRoomExists(roomId);
    const { status: userStatus } = await this.checkIfUserFoundInRoom(
      roomId,
      userId,
    );

    if (!roomStatus) {
      return new ConflictException(
        'Room with id[' + roomId + '] does not exists',
      );
    }

    if (userStatus) {
      return new ConflictException('User already found in this room');
    }

    return await this.roomUserRepository.save({
      carColor: carColor,
      roomId: roomId,
      userId: userId,
    });
  }

  async leaveRoom(roomId: string, userId: string) {
    const { status: roomStatus } = await this.checkIfRoomExists(roomId);
    const { status: userStatus } = await this.checkIfUserFoundInRoom(
      roomId,
      userId,
    );

    if (!roomStatus) {
      return new ConflictException(
        'Room with id[' + roomId + '] does not exists',
      );
    }

    if (!userStatus) {
      return new ConflictException('User not found in this room');
    }

    return await this.roomUserRepository.delete({
      roomId: roomId,
      userId: userId,
    });
  }

  async updateCarColor(userId: any, roomId: string, carColor: string) {
    const roomUser = await this.roomUserRepository.findOne({
      where: {
        userId: userId,
        roomId: roomId,
      },
    });

    if (!roomUser) {
      return new ConflictException('User does not exists inside the room');
    }

    return await this.roomUserRepository.update(
      {
        id: roomUser['id'],
      },
      {
        carColor: carColor,
      },
    );
  }
}
