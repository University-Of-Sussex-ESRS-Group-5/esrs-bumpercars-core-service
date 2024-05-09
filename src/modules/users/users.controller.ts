import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiResponseFailModel } from '../common/model/api-result.model';
import { GetListUsersResDTO, GetListUsersReqDTO } from './dtos/get-list-users.dto';
import { UsersService } from './services/users.service';
import { ApiResult } from '../common/classes/api-result';
import { Body, UsePipes, ValidationPipe } from '@nestjs/common';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Get('')
    @ApiResponse({
        status: HttpStatus.OK,
        type: GetListUsersResDTO,
        description: 'get list users success',
    })
    @ApiResponse({
        status: 404,
        type: ApiResponseFailModel,
        description: 'get list users fail',
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getListUsers(@Query() query: GetListUsersReqDTO,
    ) {
        const users = await this.usersService.getListUsers(query);

        return new ApiResult().success(users);
    }
}