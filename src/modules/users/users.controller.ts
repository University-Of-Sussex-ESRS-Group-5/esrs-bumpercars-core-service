import { Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseFailModel } from '../common/model/api-result.model';
import {
  GetListUsersResDTO,
  GetListUsersReqDTO,
} from './dtos/get-list-users.dto';
import { UsersService } from './services/users.service';
import { ApiResult } from '../common/classes/api-result';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserReqDTO } from './dtos/register-user.dto';
import {
  LoginUserWithEmailReqDTO,
  LoginUserWithUsernameReqDTO,
} from './dtos/login-user.dto';
import { LoginSuccessResp } from './dtos/login-success.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
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
  async getListUsers(@Query() query: GetListUsersReqDTO) {
    const users = await this.usersService.getListUsers(query);

    return new ApiResult().success(users);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterUserReqDTO,
    description: 'Registers users success',
  })
  @ApiResponse({
    status: 404,
    type: ApiResponseFailModel,
    description: 'Registers users fail',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async registersUser(@Query() query: RegisterUserReqDTO) {
    await this.usersService.registerUser(query);
    return new ApiResult().success({
      status: 'user created successfully',
    });
  }

  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginSuccessResp,
    description: 'login users with email',
  })
  @ApiResponse({
    status: 404,
    type: ApiResponseFailModel,
    description: 'login users with email fail',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async loginUser(@Query() query: LoginUserWithEmailReqDTO) {
    const jwtToken = await this.usersService.loginUserWithEmail(query);
    return new ApiResult().success(jwtToken);
  }

  @Post('login/username')
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginSuccessResp,
    description: 'login users with username',
  })
  @ApiResponse({
    status: 404,
    type: ApiResponseFailModel,
    description: 'login users with username fail',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async loginUserWithUsername(@Query() query: LoginUserWithUsernameReqDTO) {
    const jwtToken = await this.usersService.loginUserWithUsername(query);
    return new ApiResult().success(jwtToken);
  }

  @Get('ranking')
  @ApiResponse({
    status: HttpStatus.OK,
    type: LoginSuccessResp,
    description: 'login users with username',
  })
  @ApiResponse({
    status: 404,
    type: ApiResponseFailModel,
    description: 'login users with username fail',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async ranking() {
    return new ApiResult().success(await this.usersService.getRanking());
  }
}
