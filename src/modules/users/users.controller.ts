import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseFailModel } from '../common/model/api-result.model';
import {
  GetListUsersResDTO,
  GetListUsersReqDTO,
} from './dtos/get-list-users.dto';
import { RegisterDTO } from './dtos/register.dto';
import { UsersService } from './services/users.service';
import { ApiResult } from '../common/classes/api-result';
import { Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDTO } from './dtos/login.dto';
import { PublicRankingDTO } from './dtos/get-public-ranking.dto';
import { AuthGuard } from './auth.guard';

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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getListUsers(@Query() query: GetListUsersReqDTO) {
    const users = await this.usersService.getListUsers(query);

    return new ApiResult().success(users);
  }

  @Post('/register')
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetListUsersResDTO,
    description: 'Register successful',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async registerEmail(@Body() data: RegisterDTO) {
    const { email, password, username } = data;
    const dataResponse = await this.usersService.register(
      email,
      password,
      username,
    );
    return new ApiResult().success(dataResponse);
  }

  @Post('/signin')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sign-in successful',
    type: ApiResult,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async signIn(@Body() data: LoginDTO) {
    const { usernameOrEmail, password } = data;
    const dataResponse = await this.usersService.signin(
      usernameOrEmail,
      password,
    );
    return new ApiResult().success(dataResponse);
  }

  @Get('/public-ranking')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get public ranking',
    type: PublicRankingDTO,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getPublicRanking() {
    const dataResponse = await this.usersService.getPublicRanking();
    return new ApiResult().success(dataResponse);
  }
}
