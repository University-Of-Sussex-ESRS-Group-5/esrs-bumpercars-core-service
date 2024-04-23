import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './services/games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameUser } from './entities/game-user.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, GameUser, Room, User])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
