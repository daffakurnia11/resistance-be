import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Mission } from '@prisma/client';
import { IsUUID } from 'class-validator';

export class MissionDTO implements Mission {
  result: $Enums.MissionEnum | null;
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;

  status: $Enums.MissionStatusEnum;

  @ApiProperty({ required: true })
  @IsUUID()
  leader_id: string;

  @ApiProperty({ required: true })
  @IsUUID()
  lobby_id: string;
}
