import {IsEnum, IsUUID, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import { IRoomStatus, IRoomType } from '../typings/room.type';

export class CreateRoomDTO {
    @ApiProperty({
        description: 'The type of the room, either PUBLIC or PRIVATE',
        example: 'PUBLIC',
        enum: ['PUBLIC', 'PRIVATE'],
    })

    @ApiProperty({
        description: 'UUID of the leader of the room',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    leaderId: string;

    @ApiProperty({type: String})
    @IsString()
    code: string;

    @ApiProperty({enum: IRoomType, enumName: 'IRoomType'})
    @IsEnum(IRoomType)
    type: IRoomType = IRoomType.public;

    @ApiProperty({enum: IRoomStatus, enumName: 'IRoomStatus'})
    @IsEnum(IRoomStatus)
    status: IRoomStatus = IRoomStatus.waiting;
}
