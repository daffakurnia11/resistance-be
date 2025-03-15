import { Injectable } from '@nestjs/common';
import { PlayerRepository } from '../repository/player.repository';
import { PlayerRoleGeneratorService } from '../service/player.role.generator.service';
import { PlayerAssignRoleDTO } from '../dto/player.assign.role.dto';
import { EventBus } from '@nestjs/cqrs';
import { LobbyLogAction } from '@src/modules/lobby-log/dto/lobby.log.dto';
import { LobbyLogEvent } from '@src/modules/lobby-log/events/lobby.log.event.handler';

@Injectable()
export class PlayerAssignManager {
  constructor(
    protected readonly playerRepo: PlayerRepository,
    protected readonly playerRoleGenerator: PlayerRoleGeneratorService,
    protected readonly eventBus: EventBus,
  ) {}

  async execute(payload: PlayerAssignRoleDTO) {
    try {
      await this.playerRoleGenerator.execute(payload.lobby_id);
      const masterPlayer = await this.playerRepo.findOneByWhere({
        lobby_id: payload.lobby_id,
      });

      if (!masterPlayer) {
        return Promise.reject(new Error('Master player not found'));
      }
      this.eventBus.publish(
        new LobbyLogEvent({
          action: LobbyLogAction.ASSIGN,
          lobby_id: payload.lobby_id,
          player_id: masterPlayer.id,
        }),
      );

      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
