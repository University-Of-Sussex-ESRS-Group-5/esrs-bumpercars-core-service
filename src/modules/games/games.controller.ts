import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GamesService } from './services/games.service';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}
}
