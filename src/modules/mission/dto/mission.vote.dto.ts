import { ApiProperty } from '@nestjs/swagger';
import { MissionVoteEnum } from '@prisma/client';
import { ArrayMinSize, IsIn, IsUUID } from 'class-validator';

export class MissionVoteDTO {
  @ApiProperty({ type: 'string', required: true, nullable: false })
  @IsUUID()
  player_id: string;

  @ApiProperty({ type: [String], required: true, nullable: false })
  @ArrayMinSize(1)
  mission_players: string[];

  @ApiProperty({ enum: MissionVoteEnum, required: true, nullable: false })
  @IsIn(Object.values(MissionVoteEnum))
  vote: MissionVoteEnum;
}
