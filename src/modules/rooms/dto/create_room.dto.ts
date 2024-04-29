import { IsEnum, IsString } from 'class-validator';
import { IRoomStatus, IRoomType } from '../typings/room.type';
export class CreateRoomDTO {
  @IsString()
  code: string;

  @IsEnum(IRoomType)
  type: IRoomType = IRoomType.public;

  @IsEnum(IRoomStatus)
  status: IRoomStatus = IRoomStatus.waiting;
}
