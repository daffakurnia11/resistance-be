import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../repository/player.repository';
import { PlayerRoleGeneratorService } from '../service/player.role.generator.service';
import { PlayerAssignRoleDTO } from '../dto/player.assign.role.dto';

@Injectable()
export class PlayerAssignManager {
  constructor(
    protected readonly playerRepo: PlayerRepository,
    protected readonly playerRoleGenerator: PlayerRoleGeneratorService,
  ) {}

  async execute(payload: PlayerAssignRoleDTO) {
    try {
      await this.playerRoleGenerator.execute(payload.lobby_id);

      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
