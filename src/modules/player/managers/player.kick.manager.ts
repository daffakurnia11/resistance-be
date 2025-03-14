import { Injectable } from '@nestjs/common';
import { PlayerGateway } from '../gateway/player.gateway';
import { LobbyRepository } from '@src/modules/lobby/repository/lobby.repository';
import { PlayerLeaveDTO } from '../dto/player.dto';
import { PlayerRepository } from '../repository/player.repository';
import { EventBus } from '@nestjs/cqrs';
import { LobbyLogEvent } from '@src/modules/lobby-log/events/lobby.log.event.handler';
import { LobbyLogAction } from '@src/modules/lobby-log/dto/lobby.log.dto';
import { PlayerJoinAndUpdateEvent } from '../events/player.join.and.update.event.handler';

@Injectable()
export class PlayerKickManager {
  constructor(
    protected readonly playerGateway: PlayerGateway,
    protected readonly lobbyRepository: LobbyRepository,
    protected readonly playerRepository: PlayerRepository,
    protected readonly eventBus: EventBus,
  ) {}

  async execute(payload: PlayerLeaveDTO) {
    return await this.baseLeaveOrKick({
      room_code: payload.room_code,
      player_id: payload.player_id,
      action: LobbyLogAction.KICK,
    });
  }

  async baseLeaveOrKick(data: {
    room_code: string;
    player_id: string;
    action: string;
  }) {
    await this.playerRepository.softDelete(data.player_id);
    this.eventBus.publish(new PlayerJoinAndUpdateEvent(data.room_code));

    const lobby = await this.lobbyRepository.findOne(data.room_code);

    this.eventBus.publish(
      new LobbyLogEvent({
        action: data.action as LobbyLogAction,
        lobby_id: lobby.id,
        player_id: data.player_id,
      }),
    );
    return {
      statusCode: 204,
      success: true,
      message: 'No Content',
      data: null,
    };
  }
}
