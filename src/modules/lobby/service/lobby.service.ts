import { Injectable } from '@nestjs/common';
import { LobbyRepository } from '../repository/lobby.repository';
import { PlayerRepository } from 'src/modules/player/repository/player.repository';
import { v7 as uuidv7 } from 'uuid';
import { LobbyGateway } from '../gateway/lobby.gateway';

@Injectable()
export class LobbyService {
  constructor(
    protected lobbyRepository: LobbyRepository,
    protected playerRepository: PlayerRepository,
    private readonly lobbyGateway: LobbyGateway,
  ) {}

  async get(data: { room_code: string }) {
    const lobby = await this.lobbyRepository.getWithPlayer({
      room_code: data.room_code,
    });
    return lobby;
  }

  async create(data: { name: string }) {
    const roomId = uuidv7();
    const playerId = uuidv7();
    const randomRoom = Math.floor(100000 + Math.random() * 900000);
    const lobby = await this.lobbyRepository.create({
      id: roomId,
      room_code: randomRoom.toString(),
    });
    const player = await this.playerRepository.create({
      id: playerId,
      name: data.name,
      lobby_id: roomId,
      room_role: 'MASTER',
    });
    return {
      lobby,
      player,
    };
  }

  async updateSocket(room_code: string) {
    const updatedLobby = await this.lobbyRepository.getWithPlayer({
      room_code: room_code,
    });
    this.lobbyGateway.server.emit('join_lobby', room_code);
    this.lobbyGateway.server.emit('lobby_update', updatedLobby);
  }

  async join(data: { room_code: string; name: string }) {
    const lobby = await this.lobbyRepository.findOne({
      room_code: data.room_code,
    });
    if (!lobby) {
      throw new Error('Lobby not found');
    }
    const playerId = uuidv7();
    const player = await this.playerRepository.create({
      id: playerId,
      name: data.name,
      lobby_id: lobby.id,
      room_role: 'MEMBER',
    });
    await this.updateSocket(data.room_code);
    return {
      lobby,
      player,
    };
  }

  async leave(data: { room_code: string; player_id: string }) {
    await this.playerRepository.softDelete(data.player_id);
    await this.updateSocket(data.room_code);
  }
}
