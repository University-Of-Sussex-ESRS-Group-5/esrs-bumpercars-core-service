import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiResponseFailModel } from '../common/model/api-result.model';
import { GamesService } from './services/games.service';
import { ApiResult } from '../common/classes/api-result';
import { Body, UsePipes, ValidationPipe } from '@nestjs/common';

@ApiTags('games')
@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) { }
}