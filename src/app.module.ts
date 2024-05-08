import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { DataSource } from 'typeorm';
import { CommonModule } from './modules/common/common.module';
import { UsersModule } from '@modules/users/users.module';
import { RoomsModule } from '@modules/rooms/rooms.module';
import { GamesModule } from '@modules/games/games.module';
import { ChatsModule } from '@modules/chats/chats.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ResetToken } from '@modules/users/entities/reset-token.entity';
import { ResetTokenRepository } from '@modules/users/repositories/reset-token.repository';
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
    MailerModule.forRoot({
      // TODO: Replace with your actual SMTP server details
      transport: {
        host: 'smtp.gmail.com', // Gmail's SMTP server
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'sultana.attar25@gmail.com', // generated ethereal user
          pass: 'Sul@2504#', // generated ethereal password
        },
      },
      defaults: {
        from: '"No Reply" <sultana.attar25@gmail.com>', // outgoing email ID
      },
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
