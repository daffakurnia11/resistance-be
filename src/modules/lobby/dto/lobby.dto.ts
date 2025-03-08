import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateLobbyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

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
