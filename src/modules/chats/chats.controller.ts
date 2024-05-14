import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Query,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {ApiResponseFailModel} from '../common/model/api-result.model';
import { ChatsService } from './services/chats.service';
import { FetchChatDto } from './dtos/chats.dto';
import { SendMessageDTO } from './dto/send_message.dto';
import { Chat } from './entities/chat.entity';
import { AuthGuard } from '@modules/users/auth.guard';
import {ApiResult} from '../common/classes/api-result';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('history')
  @ApiOperation({
    summary: 'Fetch chat history for a specific room or the public lobby',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved chat history',
    type: Chat,
    isArray: true,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getChatHistory(@Query() fetchChatDto: FetchChatDto): Promise<Chat[]> {
    return this.chatsService.getChatHistory(fetchChatDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/lobby')
  @ApiOperation({ summary: 'Get all lobbies' })
  @ApiResponse({
    status: 200,
    description: 'Get all lobbies',
    type: [Chat],
  })
  async getAllLobby(@Req() request: any) {
    const { userId } = request['user'];
    return await this.chatsService.getAllLobby(userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/rooms')
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({
    status: 200,
    description: 'Get all rooms',
    type: [Chat],
  })
  async getAllRooms(@Req() request: any) {
    const { userId } = request['user'];
    return await this.chatsService.getAllRooms(userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/room/:roomId')
  @ApiOperation({ summary: 'Create a room' })
  @ApiResponse({
    status: 200,
    description: 'Create a room',
    type: Chat,
  })
  @ApiParam({ name: 'roomId', type: String })
  async createRoom(@Req() request: any, @Param() params: any) {
    const { roomId } = params;
    const { userId } = request['user'];
    return await this.chatsService.createRoom(userId, roomId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/lobby/:roomId')
  @ApiOperation({ summary: 'Create a lobby' })
  @ApiResponse({
    status: 200,
    description: 'Create a lobby',
    type: Chat,
  })
  @ApiParam({ name: 'roomId', type: String })
  async createLobby(@Req() request: any, @Param() params: any) {
    const { roomId } = params;
    const { userId } = request['user'];
    return await this.chatsService.createLobby(userId, roomId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/room/:roomId/messages')
  @ApiOperation({ summary: 'get room messages' })
  @ApiResponse({
    status: 200,
    description: 'get room messages',
    type: [Chat],
  })
  @ApiParam({ name: 'roomId', type: String })
  async getRoomMessages(@Param() params: any) {
    const { roomId } = params;
    return await this.chatsService.getMessages(roomId, 'ROOM');
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/lobby/:roomId/messages')
  @ApiOperation({ summary: 'get lobby messages' })
  @ApiResponse({
    status: 200,
    description: 'get lobby messages',
    type: [Chat],
  })
  @ApiParam({ name: 'roomId', type: String })
  async getLobbyMessages(@Param() params: any) {
    const { roomId } = params;
    return await this.chatsService.getMessages(roomId, 'LOBBY');
  }

  // @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/room/:roomId/message')
  @ApiOperation({ summary: 'send message in room' })
  @ApiResponse({
    status: 200,
    description: 'send message in room',
    type: Chat,
  })
  @ApiParam({ name: 'roomId', type: String })
  async createRoomMessages(
    @Req() request: any,
    @Param() params: any,
    @Body() body: SendMessageDTO,
  ) {
    const { roomId } = params;
    const { userId } = request['user'];
    const { message } = body;
    return await this.chatsService.createMessage(
      roomId,
      userId,
      message,
      'ROOM',
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/lobby/:roomId/message')
  @ApiOperation({ summary: 'send message in lobby' })
  @ApiResponse({
    status: 200,
    description: 'send message in lobby',
    type: Chat,
  })

  @ApiParam({ name: 'roomId', type: String })
  async createLobbyMessages(
    @Req() request: any,
    @Param() params: any,
    @Body() body: SendMessageDTO,
  ) {
    const { roomId } = params;
    const { userId } = request['user'];
    const { message } = body;
    return await this.chatsService.createMessage(
      roomId,
      userId,
      message,
      'LOBBY',
    );
  }
}
