import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  Query,
    Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseFailModel } from '../common/model/api-result.model';
import { RoomsService } from './services/rooms.service';
// import {AuthGuard} from 'src/guards/auth.guard';
import {UsersService} from '@modules/users/services/users.service';
import { RoomUser } from './entities/room-user.entity';
import { Room } from './entities/room.entity';
import { User } from '@modules/users/entities/user.entity';
import { ApiResult } from '../common/classes/api-result';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  GetListRoomsResDTO,
  GetListRoomsReqDTO,
} from './dto/get-list-room.dto';
import { CreateRoomDTO } from './dto/create-room.dto';
import { JoinRoomDTO } from './dto/join-room.dto';
import { ChangeCarColorDTO } from './dto/change-color.dto';
import { AuthGuard } from '@modules/users/auth.guard';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListRoomsResDTO,
    description: 'get list room success',
  })
  @ApiResponse({
    status: 404,
    type: ApiResponseFailModel,
    description: 'get list room fail',
  })
  @ApiOperation({ summary: 'Get list of room' })
  async getListUsers(@Query() query: GetListRoomsReqDTO) {
    return new ApiResult().success(await this.roomsService.getListRooms(query));
  }

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create room' })
  @ApiResponse({
    status: 200,
    description: 'Returns newly created room',
    type: Room,
  })
  async createRoom(@Req() request: any, @Body() createRoomDTO: CreateRoomDTO) {
    const { code, type, status } = createRoomDTO;
    console.log(request['user']);
    const { userId } = request['user'];
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    const user = await this.roomsService.getUserById(userId);
    if (!user) {
      throw new HttpException('Leader ID not found', HttpStatus.CONFLICT);
    }

    return new ApiResult().success(
      await this.roomsService.createRoom(code, type, status, user.id),
    );
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':roomId/users')
  @ApiOperation({ summary: 'Get all users of a room' })
  @ApiResponse({
    status: 200,
    description: 'Get all users of a room',
    type: [User],
  })
  @ApiParam({ name: 'roomId', type: String })
  async getRoomUsers(@Param() params: any) {
    const { roomId } = params;
    return new ApiResult().success(
      await this.roomsService.getRoomUsers(roomId),
    );
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':roomId')
  @ApiOperation({ summary: 'Get room by Room ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns room',
    type: Room,
  })
  @ApiParam({ name: 'roomId', type: String })
  async getRoom(@Param() params: any) {
    const { roomId } = params;
    return new ApiResult().success(await this.roomsService.getRoomByID(roomId));
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post(':roomId')
  @ApiOperation({ summary: 'Join room' })
  @ApiResponse({
    status: 200,
    description: 'Returns Room User Object',
    type: RoomUser,
  })
  @ApiParam({ name: 'roomId', type: String })
  async joinRoom(
    @Req() request: any,
    @Param() params: any,
    @Body() body: JoinRoomDTO,
  ): Promise<RoomUser> {
    const { roomId } = params;
    const { carColor } = body;

    const { userId } = request['user'];
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    return await this.roomsService.joinRoom(roomId, userId, carColor);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':roomId')
  @ApiOperation({ summary: 'Leave a room' })
  @ApiResponse({
    status: 200,
    description: 'Status of a user leaving room',
    type: Room,
  })
  @ApiParam({ name: 'roomId', type: String })
  @HttpCode(200)
  async leaveRoom(@Req() request: any, @Param() params: any) {
    const { roomId } = params;

    const { userId } = request['user'];

    if (await this.roomsService.leaveRoom(roomId, userId)) {
      return;
    } else {
      throw new HttpException('some error', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':roomId')
  @ApiOperation({ summary: 'Update car color' })
  @ApiResponse({
    status: 200,
    description: 'Car color updated in a room',
    type: Room,
  })
  @ApiParam({ name: 'roomId', type: String })
  async changeCarColor(
    @Req() request: any,
    @Param() params: any,
    @Body() body: ChangeCarColorDTO,
  ) {
    const { carColor } = body;
    const { roomId } = params;

    const { userId } = request['user'];

    return new ApiResult().success(
      await this.roomsService.updateCarColor(userId, roomId, carColor),
    );
  }

  @UseGuards(AuthGuard)
  @Put(':roomId/games')
  @ApiOperation({ summary: 'get all games by room Id' })
  @ApiResponse({
    status: 200,
    description: 'get all games by room Id',
    type: Room,
  })
  @ApiParam({ name: 'roomId', type: String })
  async getAllGamesByRoomId(@Req() request: any, @Param() params: any) {
    const { roomId } = params;

    return new ApiResult().success(
      await this.roomsService.getAllGamesByRoomId(roomId),
    );
  }
}
