import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomUser } from './entities/room-user.entity';
import { Room } from './entities/room.entity';

@WebSocketGateway({
  namespace: '/room',
  cors: {
    origin: '*',
  },
})
export class RoomsGateway {
  constructor(
    @InjectRepository(RoomUser)
    private roomUserRepository: Repository<RoomUser>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Room WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    await this.roomUserRepository.delete({
      roomId: client.data.roomId,
      userId: client.data.userId,
    });
    client.leave(client.data.roomId);
    this.server
      .to(client.data.roomId)
      .emit('playerLeft', { userId: client.data.userId });
    console.log(`Client ${client.id} left room ${client.data.roomId}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { roomId: string; code?: string; userId: string; carColor: string },
  ): Promise<void> {
    try {
      client.data.roomId = data.roomId;
      client.data.userId = data.userId;

      let room;
      if (data.roomId && data.code) {
        room = await this.roomRepository.findOne({
          where: {
            code: data.code,
            id: data.roomId,
            type: 'PRIVATE',
            status: 'WAITING',
          },
        });
      } else {
        room = await this.roomRepository.findOne({
          where: {
            id: data.roomId,
            type: 'PUBLIC',
            status: 'WAITING',
          },
          order: {
            createdAt: 'ASC',
          },
        });
      }

      if (!room) {
        client.emit('error', 'Room not found');
        return;
      }

      const roomUser = this.roomUserRepository.create({
        roomId: room.id,
        userId: data.userId,
        carColor: data.carColor,
        status: 'WAITING',
      });

      await this.roomUserRepository.save(roomUser);

      client.join(room.id);
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('changeCarColor')
  async handleChangeCarColor(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { roomId: string; userId: string; newCarColor: string },
  ): Promise<void> {
    try {
      const roomUser = await this.roomUserRepository.findOne({
        where: {
          roomId: data.roomId,
          userId: data.userId,
        },
      });

      if (!roomUser) {
        client.emit('error', 'Room user not found');
        return;
      }

      roomUser.carColor = data.newCarColor;
      await this.roomUserRepository.save(roomUser);
      this.server.to(data.roomId).emit('carColorChanged', {
        userId: data.userId,
        newCarColor: data.newCarColor,
      });
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('setReady')
  async handleSetReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ): Promise<void> {
    try {
      const roomUser = await this.roomUserRepository.findOne({
        where: { roomId: data.roomId, userId: data.userId },
      });
      if (roomUser) {
        roomUser.status = 'READY';
        await this.roomUserRepository.save(roomUser);
        this.server
          .to(data.roomId)
          .emit('playerReady', { userId: data.userId });
      }
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ): Promise<void> {
    try {
      await this.roomUserRepository.delete({
        roomId: data.roomId,
        userId: data.userId,
      });
      client.leave(data.roomId);
      this.server.to(data.roomId).emit('playerLeft', { userId: data.userId });
      console.log(`Client ${client.id} left room ${data.roomId}`);
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('startGame')
  async handleStartGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ): Promise<void> {
    try {
      const roomUsers = await this.roomUserRepository.find({
        where: { roomId: data.roomId, status: 'WAITING' },
      });
      if (roomUsers.length === 0) {
        await this.roomRepository.update(data.roomId, { status: 'INGAME' });
        this.server.to(data.roomId).emit('gameStarted');
        console.log(`Game started in room ${data.roomId}`);
      } else {
        client.emit('error', 'Not all players are ready');
      }
    } catch (error) {
      client.emit('error', error.message);
    }
  }
}
