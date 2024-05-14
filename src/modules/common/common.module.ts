import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { HttpExceptionFilter } from './exceptions.filter';
import { CommonService } from './services/common.service';
import { CommonController } from './common.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AppGateway } from '@modules/common/websocket.gateway';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([]), CacheModule.register()],
  controllers: [CommonController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    CommonService,
    AppGateway,
  ],
  exports: [CommonService, AppGateway],
})
export class CommonModule {}
