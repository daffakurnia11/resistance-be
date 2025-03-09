import { Injectable } from '@nestjs/common';
import { LobbyRepository } from '../repository/lobby.repository';
import { PlayerRepository } from 'src/modules/player/repository/player.repository';
import { v7 as uuidv7 } from 'uuid';
import { PlayerGateway } from 'src/modules/player/gateway/player.gateway';

@Injectable()
export class LobbyService {
  constructor(
    protected lobbyRepository: LobbyRepository,
    protected playerRepository: PlayerRepository,
    private readonly playerGateway: PlayerGateway,
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

  async delete(data: { id: string }) {
    await this.playerRepository.bulkSoftDelete(data.id);
    this.playerGateway.server.emit('player_update', {
      room_code: null,
      players: [],
    });
    return await this.lobbyRepository.softDelete(data);
  }
}
