import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDTO {
  @ApiPropertyOptional({
    description: 'Username or Email of the user',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'Password of the user',
    required: true,
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
