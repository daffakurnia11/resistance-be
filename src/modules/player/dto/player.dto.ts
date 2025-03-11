import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class JoinLobbyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  room_code: string;
}

export class LeaveLobbyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  room_code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  player_id: string;
}

export enum PlayerRoomRole {
  MASTER = 'MASTER',
  MEMBER = 'MEMBER',
}

export class PlayerJoinDTO {
  room_code: string;
  name: string;
}

export class PlayerLeaveDTO {
  room_code: string;
  player_id: string;
}

export class PlayerTypeDTO {
  name: string;
  lobby_id: string;
  id: string;
  room_role: PlayerRoomRole;
}
