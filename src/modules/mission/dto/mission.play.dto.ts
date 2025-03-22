import { ApiProperty } from '@nestjs/swagger';
import { MissionEnum } from '@prisma/client';
import { IsIn, IsUUID } from 'class-validator';

export class MissionPlayDTO {
  @ApiProperty({ type: 'string', required: true, nullable: false })
  @IsUUID()
  player_id: string;

  @ApiProperty({ enum: MissionEnum, required: true, nullable: false })
  @IsIn(Object.values(MissionEnum))
  state: MissionEnum;
}
