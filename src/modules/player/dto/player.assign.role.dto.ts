import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PlayerAssignRoleDTO {
  @ApiProperty({ type: 'string', required: true, nullable: false })
  @IsUUID()
  lobby_id: string;
}
