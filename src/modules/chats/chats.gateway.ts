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
import { Chat } from './entities/chat.entity';

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChatsGateway {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Chat WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      room?: string;
      userId: string;
      message: string;
    },
  ): Promise<void> {
    // Create a new chat message in the database
    const chat = this.chatRepository.create({
      roomId: data.room !== 'lobby' ? data.room : '',
      userId: data.userId,
      message: data.message,
      chatType: data.room !== 'lobby' ? 'ROOM' : 'LOBBY',
    });
    await this.chatRepository.save(chat);

    // Emit the message to the room or to all connected clients for lobby
    const chatRoom = data.room !== 'lobby' ? data.room : 'lobby';
    this.server.to(chatRoom as any).emit('receiveMessage', chat);

    console.log(
      `Message sent by ${data.userId} in ${chatRoom}: ${data.message}`,
    );
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ): Promise<void> {
    await client.join(data.room);
    console.log(`Client ${client.id} joined room ${data.room}`);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ): Promise<void> {
    client.leave(data.room);
    console.log(`Client ${client.id} left room ${data.room}`);
  }
}
