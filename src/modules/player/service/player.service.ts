import { v7 as uuidv7 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { LobbyRepository } from 'src/modules/lobby/repository/lobby.repository';
import { PlayerRepository } from '../repository/player.repository';
import { PlayerGateway } from '../gateway/player.gateway';
import { EventBus } from '@nestjs/cqrs';
import { LobbyLogEvent } from '@src/modules/lobby-log/events/lobby.log.event.handler';
import { LobbyLogAction } from '@src/modules/lobby-log/dto/lobby.log.dto';

@Injectable()
export class PlayerService {
  constructor(
    protected lobbyRepository: LobbyRepository,
    protected playerRepository: PlayerRepository,
    private readonly playerGateway: PlayerGateway,
    protected readonly eventBus: EventBus,
  ) {}

  async updateSocket(room_code: string) {
    const updatedLobby = await this.lobbyRepository.getWithPlayer({
      room_code: room_code,
    });
    this.playerGateway.server.emit('player_join', room_code);
    this.playerGateway.server.emit('player_update', updatedLobby);
  }

  async join(data: { room_code: string; name: string }) {
    const lobby = await this.lobbyRepository.findOne({
      room_code: data.room_code,
    });
    const playerCount = await this.playerRepository.countPlayerInLobby(
      lobby.id,
    );

    if (playerCount < 5) {
      const playerId = uuidv7();
      const player = await this.playerRepository.create({
        id: playerId,
        name: data.name,
        lobby_id: lobby.id,
        room_role: 'MEMBER',
      });
      await this.updateSocket(data.room_code);

      this.eventBus.publish(
        new LobbyLogEvent({
          action: LobbyLogAction.JOIN,
          lobby_id: lobby.id,
          player_id: playerId,
        }),
      );
      return {
        lobby,
        player,
      };
    } else {
      return {
        statusCode: 400,
        success: false,
        message: 'Oops! The lobby has been full.',
      };
    }
  }

  async leave(data: { room_code: string; player_id: string }) {
    await this.playerRepository.softDelete(data.player_id);
    const profile = await this.playerRepository.findById(data.player_id);
    await this.updateSocket(data.room_code);
    return {
      statusCode: 204,
      success: true,
      message: 'No Content',
      data: null,
    };
  }
}
