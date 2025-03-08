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
      lobby_id: lobby.id,
      player_id: player.id,
      room_code: lobby.room_code,
      player_name: player.name,
      room_role: player.room_role,
    };
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

    const updatedLobby = await this.lobbyRepository.getWithPlayer({
      room_code: data.room_code,
    });

    this.lobbyGateway.server.to(data.room_code).emit('lobby_update', {
      room_code: updatedLobby?.room_code,
      players: updatedLobby?.players,
    });
    return {
      lobby_id: lobby.id,
      player_id: player.id,
      room_code: lobby.room_code,
      player_name: player.name,
      room_role: player.room_role,
    };
  }

  async get(data: { room_code: string }) {
    const lobby = await this.lobbyRepository.getWithPlayer({
      room_code: data.room_code,
    });
    if (!lobby) {
      throw new Error('Lobby not found');
    }
    return lobby;
  }
}
