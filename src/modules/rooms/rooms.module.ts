import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './services/rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomUser } from './entities/room-user.entity';
import { User } from '../users/entities/user.entity';
import { RoomsGateway } from './rooms.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Room, User, RoomUser])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway],
})
export class RoomsModule {}
