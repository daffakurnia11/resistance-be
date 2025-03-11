import { v7 as uuidv7 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { LobbyRepository } from 'src/modules/lobby/repository/lobby.repository';
import { PlayerRepository } from '../repository/player.repository';
import { PlayerGateway } from '../gateway/player.gateway';
import { EventBus } from '@nestjs/cqrs';
import { LobbyLogEvent } from '@src/modules/lobby-log/events/lobby.log.event.handler';
import { LobbyLogAction } from '@src/modules/lobby-log/dto/lobby.log.dto';
import {
  PlayerJoinDTO,
  PlayerLeaveDTO,
  PlayerRoomRole,
} from '../dto/player.dto';

@Injectable()
export class PlayerService {
  constructor(
    protected readonly lobbyRepository: LobbyRepository,
    protected readonly playerRepository: PlayerRepository,
    protected readonly playerGateway: PlayerGateway,
    protected readonly eventBus: EventBus,
  ) {}

  async updateSocket(room_code: string) {
    const updatedLobby = await this.lobbyRepository.getWithPlayer(room_code);
    this.playerGateway.server.emit('player_join', room_code);
    this.playerGateway.server.emit('player_update', updatedLobby);
  }

  async join(data: PlayerJoinDTO) {
    const lobby = await this.lobbyRepository.findOne(data.room_code);
    const playerCount = await this.playerRepository.countPlayerInLobby(
      lobby.id,
    );

    if (playerCount < 5) {
      const playerId = uuidv7();
      const player = await this.playerRepository.create({
        id: playerId,
        name: data.name,
        lobby_id: lobby.id,
        room_role: PlayerRoomRole.MEMBER,
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

  async baseLeaveOrKick(data: {
    room_code: string;
    player_id: string;
    action: string;
  }) {
    await this.playerRepository.softDelete(data.player_id);
    await this.updateSocket(data.room_code);

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

  async leave(data: PlayerLeaveDTO) {
    return await this.baseLeaveOrKick({
      ...data,
      action: LobbyLogAction.LEAVE,
    });
  }

  async kick(data: PlayerLeaveDTO) {
    return await this.baseLeaveOrKick({ ...data, action: LobbyLogAction.KICK });
  }
}
