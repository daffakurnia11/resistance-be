import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsUUID } from 'class-validator';

export class MissionAssignDTO {
  @ApiProperty({ type: 'string', required: true, nullable: false })
  @IsUUID()
  leader_id: string;

  @ApiProperty({ type: [String], required: true, nullable: false })
  @ArrayMinSize(1)
  player_ids: string[];
}
