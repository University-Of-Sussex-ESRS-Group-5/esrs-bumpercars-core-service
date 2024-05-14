import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { RoomUser } from '../entities/room-user.entity';
import { ApiError } from '@modules/common/classes/api-error';
import { ErrorCode } from '@modules/common/constants/errors';
import { IRoomStatus, IRoomType } from '../typings/room.type';
import { Game } from '@modules/games/entities/game.entity';
import { User } from '@modules/users/entities/user.entity';
import { CreateRoomDTO } from '../dto/create-room.dto';
import { JoinRoomDTO } from '../dto/join-room.dto';
import { ChangeCarColorDTO } from '../dto/change-color.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RoomUser)
    private roomUserRepository: Repository<RoomUser>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
      select: ['id', 'username', 'email', 'points', 'createdAt', 'updatedAt'],
    });
  }

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
      throw new ConflictException(
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

  async getRoomUsers(roomId: string) {
    const roomUsers = await this.roomUserRepository.find({
      where: {
        roomId: roomId,
      },
    });
    return await Promise.all(
      roomUsers.map((roomUser) =>
        this.userRepository.findOne({
          where: {
            id: roomUser['userId'],
          },
        }),
      ),
    );
  }

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
      room = await this.roomRepository.findOne({
        where: {
          type: 'PUBLIC',
          status: 'WAITING',
        },
        order: {
          createdAt: 'ASC',
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

    async joinRoom(
        roomId: string,
        userId: string,
        carColor: string,
    ): Promise<RoomUser> {
        const { status: roomStatus } = await this.checkIfRoomExists(roomId);
        const { status: userStatus } = await this.checkIfUserFoundInRoom(
            roomId,
            userId,
        );

        if (!roomStatus) {
            throw new ConflictException(
                'Room with id[' + roomId + '] does not exists',
            );
        }

        if (userStatus) {
            throw new ConflictException('User already found in this room');
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
            throw new ConflictException(
                'Room with id[' + roomId + '] does not exists',
            );
        }

        if (!userStatus) {
            throw new ConflictException('User not found in this room');
        }

        const { affected } = await this.roomUserRepository.delete({
            roomId: roomId,
            userId: userId,
        });
        if (affected && affected > 0) return true;
        else return false;
    }

    async updateCarColor(userId: any, roomId: string, carColor: string) {
        const roomUser = await this.roomUserRepository.findOne({
            where: {
                userId: userId,
                roomId: roomId,
            },
        });

        if (!roomUser) {
            throw new ConflictException('User does not exists inside the room');
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

    async getAllGamesByRoomId(roomId: string) {
        return this.gameRepository.find({
            where: {
                roomId: roomId,
            },
        });
    }
}
