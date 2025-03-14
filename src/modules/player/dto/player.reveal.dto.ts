import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PlayerRevealDTO {
  @ApiProperty({ type: 'string' })
  @IsUUID()
  lobby_id: string;

  @ApiProperty({ type: 'string' })
  @IsUUID()
  player_id: string;
}
