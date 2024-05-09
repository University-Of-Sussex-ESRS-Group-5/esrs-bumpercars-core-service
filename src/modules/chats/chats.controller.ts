import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiResponseFailModel } from '../common/model/api-result.model';
import { ChatsService } from './services/chats.service';
import { ApiResult } from '../common/classes/api-result';
import { Body, UsePipes, ValidationPipe } from '@nestjs/common';

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) { }
}