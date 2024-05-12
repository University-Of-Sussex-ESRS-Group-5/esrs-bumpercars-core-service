import { IsString } from 'class-validator';

export class JoinRoomDTO {
  @IsString()
  carColor: string;
}
