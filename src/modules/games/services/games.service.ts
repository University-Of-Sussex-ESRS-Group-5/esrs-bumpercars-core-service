import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Game } from '../entities/game.entity';
import { GameUser } from '../entities/game-user.entity';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Game)
        private gameRepository: Repository<Game>,
        @InjectRepository(GameUser)
        private gameUserRepository: Repository<GameUser>,
    ) { }
}