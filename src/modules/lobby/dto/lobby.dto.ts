import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateLobbyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
