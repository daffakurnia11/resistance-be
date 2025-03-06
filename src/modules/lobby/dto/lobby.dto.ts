import { ApiProperty } from '@nestjs/swagger';

export class LobbyDto {
  @ApiProperty()
  name: string;
}
