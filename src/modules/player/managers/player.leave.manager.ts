import { Injectable } from '@nestjs/common';
import { PlayerKickManager } from './player.kick.manager';
import { EventBus } from '@nestjs/cqrs';
import { LobbyRepository } from '../../lobby/repository/lobby.repository';
import { PlayerGateway } from '../gateway/player.gateway';
import { PlayerRepository } from '../repository/player.repository';
import { PlayerLeaveDTO } from '../dto/player.dto';
import { LobbyLogAction } from '../../lobby-log/dto/lobby.log.dto';

@Injectable()
export class PlayerLeaveManager extends PlayerKickManager {
  constructor(
    protected readonly playerGateway: PlayerGateway,
    protected readonly lobbyRepository: LobbyRepository,
    protected readonly playerRepository: PlayerRepository,
    protected readonly eventBus: EventBus,
  ) {
    super(playerGateway, lobbyRepository, playerRepository, eventBus);
  }

  async execute(
    payload: PlayerLeaveDTO,
  ): Promise<{
    statusCode: number;
    success: boolean;
    message: string;
    data: null;
  }> {
    return await this.baseLeaveOrKick({
      room_code: payload.room_code,
      player_id: payload.player_id,
      action: LobbyLogAction.LEAVE,
    });
  }
}
