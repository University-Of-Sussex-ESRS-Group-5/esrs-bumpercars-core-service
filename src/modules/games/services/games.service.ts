import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, EntityManager} from 'typeorm';
import {Game} from '../entities/game.entity';
import {GameUser} from '../entities/game-user.entity';
import {User} from '@modules/users/entities/user.entity';
import {Room} from '@modules/rooms/entities/room.entity';
import {RoomUser} from '@modules/rooms/entities/room-user.entity';
import {ApiError} from '../../common/classes/api-error';
import {ErrorCode} from '../../common/constants/errors';
import {GameRankingDTO} from '../dtos/get-game-ranking.dto';

@Injectable()
export class GamesService {
    constructor(@InjectRepository(Game)
                private gameRepository: Repository<Game>,
                @InjectRepository(GameUser)
                private gameUserRepository: Repository<GameUser>,
                @InjectRepository(Room)
                private roomRepository: Repository<Room>,
                @InjectRepository(User)
                private userRepository: Repository<User>,
                @InjectRepository(RoomUser)
                private roomUserRepository: Repository<RoomUser>,) {
    }

    async getAllGames() {
        return await this.gameRepository.find();
    }

    async getGameByID(GameId: string) {
        return await this.gameRepository.findOne({
            where: {
                id: GameId,
            },
        });
    }

    async createGame(roomId: string) {
        const room = await this.roomRepository.findOne({
            where: {
                id: roomId,
            },
        });

        if (!room) {
            throw new HttpException('Room not found', HttpStatus.CONFLICT);
        }

        // find count of
        const gameNumber = await this.gameRepository.count({
            where: {
                roomId: roomId,
            },
        });

        return await this.gameRepository.save({
            roomId: roomId,
            gameNumber: gameNumber + 1,
        });
    }


    async startGame(gameId: string) {
        const game = await this.gameRepository.findOne({
            where: {
                id: gameId,
            },
        });

        if (!game) {
            throw new HttpException('Game not found', HttpStatus.CONFLICT);
        }

        // get all room users
        const roomUsers = await this.roomUserRepository.find({
            where: {
                roomId: game['roomId'],
            },
        });
        const userIds = roomUsers.map((obj) => obj['userId']);

        return await Promise.all(
            userIds.map((userId) =>
                this.gameUserRepository.save({
                    gameId: game['id'],
                    playerId: userId,
                    points: 0,
                }),
            ),
        );
    }

    async updateScore(userId: string, gameId: string, score: number) {
        return await this.gameUserRepository.update(
            {
                gameId: gameId,
                playerId: userId,
            },
            {
                points: score,
            },
        );
    }

    async getRankingByGame(userId: string, gameId: string) {
        return await this.gameUserRepository.findOne({
            where: {
                gameId: gameId,
                playerId: userId,
            },
        });
    }
}
