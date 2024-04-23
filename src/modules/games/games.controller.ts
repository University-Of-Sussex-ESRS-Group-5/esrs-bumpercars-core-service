import { Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseFailModel } from '../common/model/api-result.model';
import { GamesService } from './services/games.service';
import { ApiResult } from '../common/classes/api-result';
import { Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@modules/users/auth.guard';
import { GetGameRankingResDTO } from './dtos/get-game-ranking.dto';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('/public-ranking/:gameId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetGameRankingResDTO,
    description: 'get game ranking success',
  })
  @ApiResponse({
    status: 404,
    type: ApiResponseFailModel,
    description: 'get game ranking fail',
  })
  async getGameRanking(@Param('gameId') gameId: string) {
    const dataResponse = await this.gamesService.getGameRanking(gameId);
    return new ApiResult().success(dataResponse);
  }
}
