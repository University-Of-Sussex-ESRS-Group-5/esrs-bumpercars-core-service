import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { DataSource } from 'typeorm';
import { CommonModule } from './modules/common/common.module';
import { UsersModule } from '@modules/users/users.module';
import { RoomsModule } from '@modules/rooms/rooms.module';
import { GamesModule } from '@modules/games/games.module';
import { ChatsModule } from '@modules/chats/chats.module';
import { LoggerModule } from 'nestjs-pino';
import { Config, RedisConfig } from '@config/types';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { ResetToken } from '@modules/users/entities/reset-token.entity';
import { ResetTokenRepository } from '@modules/users/repositories/reset-token.repository';
import * as redisStore from 'cache-manager-redis-store';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    CommonModule,
    UsersModule,
    RoomsModule,
    GamesModule,
    ChatsModule,
    LoggerModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<Config, true>) => {
        const redisConfig = configService.get<RedisConfig>('redis');
        return {
          store: redisStore,
          host: redisConfig.host,
          port: redisConfig.port,
          auth_pass: redisConfig.password,
        };
      },
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: configService.get('SMTP_SECURE'),
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: configService.get('SMTP_FROM'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ResetToken, ResetTokenRepository]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
