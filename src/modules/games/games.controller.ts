import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GamesService } from './services/games.service';
import { CreategameDTO } from './dto/create_game.dto';
import { Game } from './entities/game.entity';
import { UpdateScoreDTO } from './dto/update_score.dto';
// import { AuthGuard } from 'src/guards/auth.guard';
import { AuthGuard } from '@modules/users/auth.guard';
import { ApiResult } from '@modules/common/classes/api-result';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/')
  @ApiOperation({ summary: 'Get all games' })
  @ApiResponse({
    status: 200,
    description: 'Get all games',
    type: [Game],
  })
  async getAllGames() {
    return new ApiResult().success(await this.gamesService.getAllGames());
  }

  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @Get(':gameId')
  @ApiOperation({ summary: 'Get a game' })
  @ApiResponse({
    status: 200,
    description: 'Get a game',
    type: Game,
  })
  @ApiParam({ name: 'gameId', type: String })
  async getRoom(@Param() params: any) {
    const { gameId } = params;
    return new ApiResult().success(await this.gamesService.getGameByID(gameId));
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/')
  @ApiOperation({ summary: 'Create a game' })
  @ApiResponse({
    status: 200,
    description: 'Create a game',
    type: Game,
  })
  async createGame(@Req() request: any, @Body() body: CreategameDTO) {
    const { userId } = request['user'];
    const { roomId } = body;
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    return new ApiResult().success(await this.gamesService.createGame(roomId));
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/:gameId/start')
  @ApiOperation({ summary: 'Start a game' })
  @ApiResponse({
    status: 200,
    description: 'Start a game',
    type: Game,
  })
  @ApiParam({ name: 'gameId', type: String })
  async startGame(@Req() request: any, @Param() params: any) {
    const { gameId } = params;
    const { userId } = request['user'];
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    return new ApiResult().success(await this.gamesService.startGame(gameId));
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('/:gameId/score')
  @ApiOperation({ summary: 'Update a game score' })
  @ApiResponse({
    status: 200,
    description: 'Update a game score',
    type: Game,
  })
  @ApiParam({ name: 'gameId', type: String })
  async updateGameScore(
    @Req() request: any,
    @Body() body: UpdateScoreDTO,
    @Param() params: any,
  ) {
    const { gameId } = params;
    const { userId } = request['user'];
    const { score } = body;
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    return new ApiResult().success(
      await this.gamesService.updateScore(userId, gameId, score),
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/:gameId/score')
  @ApiOperation({ summary: 'get my score by game' })
  @ApiResponse({
    status: 200,
    description: 'get my score by game',
    type: Game,
  })
  @ApiParam({ name: 'gameId', type: String })
  async getRankingByGame(@Req() request: any, @Param() params: any) {
    const { gameId } = params;

    const { userId } = request['user'];
    if (!userId) {
      throw new HttpException('UserID not found', HttpStatus.CONFLICT);
    }

    return new ApiResult().success(
      await this.gamesService.getRankingByGame(userId, gameId),
    );
  }
}
