import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import {
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiResponseFailModel } from '../common/model/api-result.model';
import { RoomsService } from './services/rooms.service';
import { ApiResult } from '../common/classes/api-result';
import { Body, UsePipes, ValidationPipe } from '@nestjs/common';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }
}