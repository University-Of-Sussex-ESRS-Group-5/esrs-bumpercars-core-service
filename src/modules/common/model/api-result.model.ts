import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ApiStatus } from '../classes/api-result';

export class ApiResponseFailModel {
  @ApiProperty({ example: ApiStatus.ERROR })
  status: string;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  code: number;

  @ApiProperty()
  errorCode: string;

  @ApiProperty()
  message: string;
}
