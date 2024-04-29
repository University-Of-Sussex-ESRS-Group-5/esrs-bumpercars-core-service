import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './services/rooms.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UsersService } from '@modules/users/services/users.service';
import { CreateRoomDTO } from './dto/create_room.dto';
import { JoinRoomDTO } from './dto/join_room.dto';
import { ChangeColorDTO } from './dto/change_color.dto';

@ApiBearerAuth('access-token')
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('')
  async getRooms() {
    return await this.roomsService.getAllRooms();
  }

  @UseGuards(AuthGuard)
  @Post('/')
  async createRoom(@Req() request: any, @Body() createRoomDTO: CreateRoomDTO) {
    const { code, type, status } = createRoomDTO;
    const { id } = request['user'];
    if (!id) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new HttpException('Leader ID not found', HttpStatus.CONFLICT);
    }

    return await this.roomsService.createRoom(code, type, status, user.id);
  }

  @UseGuards(AuthGuard)
  @Get(':roomId')
  @ApiParam({ name: 'roomId', type: String })
  async getRoom(@Param() params: any) {
    const { roomId } = params;
    return await this.roomsService.getRoomByID(roomId);
  }

  @UseGuards(AuthGuard)
  @Post(':roomId')
  @ApiParam({ name: 'roomId', type: String })
  async joinRoom(
    @Req() request: any,
    @Param() params: any,
    @Body() body: JoinRoomDTO,
  ) {
    const { roomId } = params;
    const { carColor } = body;

    const { id } = request['user'];
    if (!id) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    return await this.roomsService.joinRoom(roomId, id, carColor);
  }

  @UseGuards(AuthGuard)
  @Delete(':roomId')
  @ApiParam({ name: 'roomId', type: String })
  async leaveRoom(@Req() request: any, @Param() params: any) {
    const { roomId } = params;

    const { id } = request['user'];

    return await this.roomsService.leaveRoom(roomId, id);
  }

  @UseGuards(AuthGuard)
  @Put(':roomId')
  @ApiParam({ name: 'roomId', type: String })
  async changeCarColor(
    @Req() request: any,
    @Param() params: any,
    @Body() body: ChangeColorDTO,
  ) {
    const { carColor } = body;
    const { roomId } = params;

    const { id } = request['user'];

    return await this.roomsService.updateCarColor(id, roomId, carColor);
  }
}
