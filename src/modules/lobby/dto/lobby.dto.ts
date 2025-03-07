import { ApiProperty } from '@nestjs/swagger';

export class CreateLobbyDto {
  @ApiProperty()
  name: string;
}

export class JoinLobbyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  room_code: string;
}
