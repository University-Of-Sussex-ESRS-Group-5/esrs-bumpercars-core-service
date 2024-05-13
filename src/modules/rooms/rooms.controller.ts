import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseFailModel } from '../common/model/api-result.model';
import { RoomsService } from './services/rooms.service';
import { ApiResult } from '../common/classes/api-result';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@modules/users/auth.guard';
import {
  GetListRoomsResDTO,
  GetListRoomsReqDTO,
} from './dto/get-list-room.dto';
import { CreateRoomDTO } from './dto/create-room.dto';
import { Room } from './entities/room.entity';
import { JoinRoomDTO } from './dto/join-room.dto';
import { RoomUser } from './entities/room-user.entity';
import { ChangeCarColorDTO } from './dto/change-color.dto';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('')
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
  @UsePipes(new ValidationPipe({ transform: true }))
  //   @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getListUsers(@Query() query: GetListRoomsReqDTO) {
    const users = await this.roomsService.getListRooms(query);

    return new ApiResult().success(users);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({
    status: 201,
    description: 'The room has been successfully created.',
    type: Room,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  //   @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async createRoom(@Body() createRoomDto: CreateRoomDTO): Promise<Room> {
    return this.roomsService.createRoom(createRoomDto);
  }

  // @Post('/join')
  // @ApiOperation({ summary: 'Join an existing room' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Successfully joined the room',
  //   type: RoomUser,
  // })
  // @UsePipes(new ValidationPipe({ transform: true }))
  // //   @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  // async joinRoom(@Body() joinRoomDto: JoinRoomDTO): Promise<RoomUser> {
  //   return this.roomsService.joinRoom(joinRoomDto);
  // }

  // @Patch('/change-car-color')
  // @ApiOperation({ summary: 'Change the car color for a user in a room' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Car color changed successfully',
  //   type: RoomUser,
  // })
  // @UsePipes(new ValidationPipe({ transform: true }))
  // //   @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  // async changeCarColor(@Body() dto: ChangeCarColorDTO): Promise<RoomUser> {
  //   return this.roomsService.changeCarColor(dto);
  // }
}
