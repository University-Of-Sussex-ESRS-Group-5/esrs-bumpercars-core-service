import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { DataSource } from 'typeorm';
import { CommonModule } from './modules/common/common.module';
import { UsersModule } from '@modules/users/users.module';
import { RoomsModule } from '@modules/rooms/rooms.module';
import { GamesModule } from '@modules/games/games.module';
import { ChatsModule } from '@modules/chats/chats.module';
// import { LoggerModule } from 'nestjs-pino';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    CommonModule,
    UsersModule,
    RoomsModule,
    GamesModule,
    ChatsModule,
    // LoggerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
