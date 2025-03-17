import { Injectable } from '@nestjs/common';
import { LobbyRepository } from '../repository/lobby.repository';
import { PlayerRepository } from 'src/modules/player/repository/player.repository';
import { v7 as uuidv7 } from 'uuid';
import { PlayerGateway } from 'src/modules/player/gateway/player.gateway';
import { EventBus, IEvent } from '@nestjs/cqrs';
import { LobbyLogEvent } from '@src/modules/lobby-log/events/lobby.log.event.handler';
import { LobbyLogAction } from '@src/modules/lobby-log/dto/lobby.log.dto';
import { Lobby, Player } from '@prisma/client';
import { PlayerRoomRole } from '@src/modules/player/dto/player.dto';

@Injectable()
export class LobbyService {
  constructor(
    protected lobbyRepository: LobbyRepository,
    protected playerRepository: PlayerRepository,
    private readonly playerGateway: PlayerGateway,
    protected readonly eventBus: EventBus,
  ) {}

  async get(room_code: string): Promise<Lobby> {
    const lobby = await this.lobbyRepository.getWithPlayer(room_code);
    if (!lobby) {
      throw new Error('Lobby not found');
    }
    return lobby;
  }

  async create(name: string): Promise<{ lobby: Lobby; player: Player }> {
    const roomId = uuidv7();
    const playerId = uuidv7();
    const randomRoom = Math.floor(100000 + Math.random() * 900000);
    const lobby = await this.lobbyRepository.create({
      id: roomId,
      room_code: randomRoom.toString(),
    });
    const player = await this.playerRepository.create({
      id: playerId,
      name,
      lobby_id: roomId,
      room_role: PlayerRoomRole.MASTER,
    });

    this.eventBus.publish(
      new LobbyLogEvent({
        action: LobbyLogAction.CREATE,
        lobby_id: lobby.id,
        player_id: player.id,
      }),
    );

    return {
      lobby,
      player,
    };
  }

  async delete(id: string): Promise<Lobby> {
    this.playerGateway.server.emit('player_update', {
      room_code: null,
      players: [],
    });
    const players = await this.playerRepository.findManyByWhere({
      lobby_id: id,
      deleted_at: null,
    });

    const events: IEvent[] = players.length
      ? players.map(
          (each) =>
            new LobbyLogEvent({
              action: LobbyLogAction.DISBAND,
              lobby_id: id,
              player_id: each.id,
            }),
        )
      : [];

    if (players.length > 0) {
      await this.playerRepository.bulkSoftDelete(id);
      this.eventBus.publishAll(events);
    }

    return await this.lobbyRepository.softDelete(id);
  }

  async getPlayers(roomCode: string) {
    return await this.lobbyRepository.getWithPlayer(roomCode);
  }

  async getMissions(roomCode: string) {
    return await this.lobbyRepository.getWithMission(roomCode);
  }
}
