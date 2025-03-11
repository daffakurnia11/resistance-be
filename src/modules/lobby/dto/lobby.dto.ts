import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLobbyDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class LobbyCreateDTO {
  id: string;
  room_code: string;
}
