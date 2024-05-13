import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiResult } from '../../common/classes/api-result';

export class RoomDTO {
  @ApiProperty({
    description: 'The unique identifier of the room',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The code of the room',
    example: 'ROOM123',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'The type of the room',
    example: 'PUBLIC',
    enum: ['PUBLIC', 'PRIVATE'],
  })
  @IsEnum(['PUBLIC', 'PRIVATE'])
  type: string;

  @ApiProperty({
    description: 'The status of the room',
    example: 'WAITING',
    enum: ['INGAME', 'WAITING'],
  })
  @IsEnum(['INGAME', 'WAITING'])
  status: string;

  @ApiProperty({
    description: 'The UUID of the room leader',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  leaderId: string;

  @ApiProperty({
    description: 'The creation timestamp of the room',
    type: Date,
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The update timestamp of the room',
    type: Date,
  })
  @IsDate()
  updatedAt: Date;
}

export class GetListRoomsReqDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly offset?: number;
}

export class GetListRoomsResDTO extends ApiResult<RoomDTO> {
  @ApiProperty({ type: RoomDTO })
  data: RoomDTO;
}
