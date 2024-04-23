import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Game } from '../entities/game.entity';
import { GameUser } from '../entities/game-user.entity';
import { ApiError } from '@modules/common/classes/api-error';
import { ErrorCode } from '@modules/common/constants/errors';
import { GameRankingDTO } from '../dtos/get-game-ranking.dto';
import { User } from '@modules/users/entities/user.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(GameUser)
    private gameUserRepository: Repository<GameUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private entityManager: EntityManager,
  ) {}

  async getGameRanking(gameId: string): Promise<GameRankingDTO[]> {
    const game = await this.gameRepository.findOneBy({ id: gameId });
    if (!game) {
      throw new ApiError(ErrorCode.GAME_NOT_FOUND);
    }

    const gameUsers = await this.gameUserRepository
      .createQueryBuilder('gu')
      .select([
        'gu.points as gu_points',
        'u.username as u_username',
        'gu.playerId as id',
      ])
      .leftJoin(User, 'u', 'u.id = gu.player_id')
      .where('gu.gameId = :gameId', { gameId })
      .orderBy('gu.points', 'DESC')
      .getRawMany();

    return gameUsers.map((gu) => {
      return {
        id: gu.id,
        username: gu.u_username,
        points: gu.gu_points,
      };
    });
  }
}
