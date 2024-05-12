import { IsString } from 'class-validator';

export class ChangeColorDTO {
  @IsString()
  carColor: string;
}
