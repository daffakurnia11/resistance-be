import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateLobbyDto {
  @ApiProperty({ example: 'Player1' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class JoinLobbyDto {
  @ApiProperty({ example: 'Player1' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '524323' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  room_code: string;
}
