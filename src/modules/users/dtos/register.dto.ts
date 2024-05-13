import { IsString, Matches, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty({ required: true, type: 'string' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Invalid email format',
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({ required: true, type: 'string' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=])[A-Za-z\d@$!%*?&=]{8,}$/,
    {
      message:
        'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character',
    },
  )
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true, type: 'string' })
  @IsString()
  @IsNotEmpty()
  username: string;
}
