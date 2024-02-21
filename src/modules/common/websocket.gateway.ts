import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Config } from '@config/types';
import { ConfigService } from '@nestjs/config';
import { Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@WebSocketGateway({ cors: true })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  constructor(
    private configService: ConfigService<Config, true>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
}
