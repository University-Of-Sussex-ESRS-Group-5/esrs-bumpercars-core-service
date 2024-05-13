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
import {RoomsService} from './services/rooms.service';
// import {AuthGuard} from 'src/guards/auth.guard';
import {UsersService} from '@modules/users/services/users.service';
import {RoomUser} from './entities/room-user.entity';
import {Room} from './entities/room.entity';
import {User} from '@modules/users/entities/user.entity';
import {ApiResult} from '../common/classes/api-result';
import {UsePipes, ValidationPipe} from '@nestjs/common';
import {
    GetListRoomsResDTO,
    GetListRoomsReqDTO,
} from './dto/get-list-room.dto';
import {CreateRoomDTO} from './dto/create-room.dto';
import {JoinRoomDTO} from './dto/join-room.dto';
import {ChangeCarColorDTO} from './dto/change-color.dto';

@ApiBearerAuth('access-token')
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {
    }

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
    @ApiOperation({summary: 'Get list of room'})
    @UsePipes(new ValidationPipe({transform: true}))
    //   @UseGuards(AuthGuard)
    async getListUsers(@Query() query: GetListRoomsReqDTO) {
        const users = await this.roomsService.getListRooms(query);

        return new ApiResult().success(users);
    }
    //
    // @Post()
    // @ApiOperation({summary: 'Create a new room'})
    // @ApiResponse({
    //     status: 201,
    //     description: 'The room has been successfully created.',
    //     type: Room,
    // })
    // @UsePipes(new ValidationPipe({transform: true}))
    // //   @UseGuards(AuthGuard)
    // async createRoom(@Body() createRoomDto: CreateRoomDTO): Promise<Room> {
    //     return this.roomsService.createRoom(createRoomDto);
    // }

    // @Post('/join')
    // @ApiOperation({summary: 'Join an existing room'})
    // @ApiResponse({
    //     status: 200,
    //     description: 'Successfully joined the room',
    //     type: RoomUser,
    // })
    // @UsePipes(new ValidationPipe({transform: true}))
    // //   @UseGuards(AuthGuard)
    // async joinRoom(@Body() joinRoomDto: JoinRoomDTO): Promise<RoomUser> {
    //     return this.roomsService.joinRoom(joinRoomDto);
    // }

    // @Patch('/change-car-color')
    // @ApiOperation({summary: 'Change the car color for a user in a room'})
    // @ApiResponse({
    //     status: 200,
    //     description: 'Car color changed successfully',
    //     type: RoomUser,
    // })
    // @UsePipes(new ValidationPipe({transform: true}))
    // //   @UseGuards(AuthGuard)
    // async changeCarColor(@Body() dto: ChangeCarColorDTO): Promise<RoomUser> {
    //     return this.roomsService.changeCarColor(dto);
    // }

    // @UseGuards(AuthGuard)
    @Get('')
    @ApiOperation({summary: 'Get all rooms'})
    @ApiResponse({
        status: 200,
        description: 'Returns all rooms',
        type: [Room],
    })
    async getRooms() {
        return await this.roomsService.getAllRooms();
    }


    // @UseGuards(AuthGuard)
    @Post('/')
    @ApiOperation({summary: 'Create room'})
    @ApiResponse({
        status: 200,
        description: 'Returns newly created room',
        type: Room,
    })
    async createRoom(@Req() request: any, @Body() createRoomDTO: CreateRoomDTO) {
        const {code, type, status} = createRoomDTO;
        const {id} = request['user'];
        if (!id) {
            throw new HttpException('UserID not found', HttpStatus.CONFLICT);
        }

        const user = await this.roomsService.getUserById(id);
        if (!user) {
            throw new HttpException('Leader ID not found', HttpStatus.CONFLICT);
        }

        return await this.roomsService.createRoom(code, type, status, user.id);
    }

    // @UseGuards(AuthGuard)
    @Get(':roomId/users')
    @ApiOperation({summary: 'Get all users of a room'})
    @ApiResponse({
        status: 200,
        description: 'Get all users of a room',
        type: [User],
    })
    @ApiParam({name: 'roomId', type: String})
    async getRoomUsers(@Param() params: any) {
        const {roomId} = params;
        return await this.roomsService.getRoomUsers(roomId);
    }

    // @UseGuards(AuthGuard)
    @Get(':roomId')
    @ApiOperation({summary: 'Get room by Room ID'})
    @ApiResponse({
        status: 200,
        description: 'Returns room',
        type: Room,
    })
    @ApiParam({name: 'roomId', type: String})
    async getRoom(@Param() params: any) {
        const {roomId} = params;
        return await this.roomsService.getRoomByID(roomId);
    }

    // @UseGuards(AuthGuard)
    @Post(':roomId')
    @ApiOperation({summary: 'Join room'})
    @ApiResponse({
        status: 200,
        description: 'Returns Room User Object',
        type: RoomUser,
    })
    @ApiParam({name: 'roomId', type: String})
    async joinRoom(@Req() request: any,
                   @Param() params: any,
                   @Body() body: JoinRoomDTO,): Promise<RoomUser> {
        const {roomId} = params;
        const {carColor} = body;

        const {id} = request['user'];
        if (!id) {
            throw new HttpException('UserID not found', HttpStatus.CONFLICT);
        }

        return await this.roomsService.joinRoom(roomId, id, carColor);
    }

    // @UseGuards(AuthGuard)
    @Delete(':roomId')
    @ApiOperation({summary: 'Leave a room'})
    @ApiResponse({
        status: 200,
        description: 'Status of a user leaving room',
        type: Room,
    })
    @ApiParam({name: 'roomId', type: String})
    @HttpCode(200)
    async leaveRoom(@Req() request: any, @Param() params: any) {
        const {roomId} = params;

        const {id} = request['user'];

        if (await this.roomsService.leaveRoom(roomId, id)) {
            return;
        } else {
            throw new HttpException('some error', HttpStatus.BAD_REQUEST);
        }
    }

    // @UseGuards(AuthGuard)
    @Put(':roomId')
    @ApiOperation({summary: 'Update car color'})
    @ApiResponse({
        status: 200,
        description: 'Car color updated in a room',
        type: Room,
    })
    @ApiParam({name: 'roomId', type: String})
    async changeCarColor(@Req() request: any,
                         @Param() params: any,
                         @Body() body: ChangeCarColorDTO,) {
        const {carColor} = body;
        const {roomId} = params;

        const {id} = request['user'];

        return await this.roomsService.updateCarColor(id, roomId, carColor);
    }

    // @UseGuards(AuthGuard)
    @Put(':roomId/games')
    @ApiOperation({summary: 'get all games by room Id'})
    @ApiResponse({
        status: 200,
        description: 'get all games by room Id',
        type: Room,
    })
    @ApiParam({name: 'roomId', type: String})
    async getAllGamesByRoomId(@Req() request: any, @Param() params: any) {
        const {roomId} = params;

        return await this.roomsService.getAllGamesByRoomId(roomId);
    }
}
