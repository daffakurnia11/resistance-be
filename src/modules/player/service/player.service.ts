import { Injectable } from '@nestjs/common';
import { PlayerJoinDTO, PlayerLeaveDTO } from '../dto/player.dto';
import { Player } from '@prisma/client';
import { PlayerRevealDTO } from '../dto/player.reveal.dto';
import { PlayerAssignManager } from '../managers/player.assign.manager';
import { PlayerAssignRoleDTO } from '../dto/player.assign.role.dto';
import { PlayerRevealManager } from '../managers/player.reveal.manager';
import { PlayerKickManager } from '../managers/player.kick.manager';
import { PlayerLeaveManager } from '../managers/player.leave.manager';
import { PlayerJoinManager } from '../managers/player.join.manager';

@Injectable()
export class PlayerService {
  constructor(
    protected readonly assignManager: PlayerAssignManager,
    protected readonly revealManager: PlayerRevealManager,
    protected readonly kickManager: PlayerKickManager,
    protected readonly leaveManager: PlayerLeaveManager,
    protected readonly joinManager: PlayerJoinManager,
  ) {}

  async join(payload: PlayerJoinDTO) {
    return await this.joinManager.execute(payload);
  }

  async leave(payload: PlayerLeaveDTO) {
    return await this.leaveManager.execute(payload);
  }

  async kick(payload: PlayerLeaveDTO) {
    return await this.kickManager.execute(payload);
  }

  async reveal(payload: PlayerRevealDTO): Promise<Player | Error> {
    return await this.revealManager.execute(payload);
  }

  async assign(payload: PlayerAssignRoleDTO) {
    return await this.assignManager.execute(payload);
  }
}
