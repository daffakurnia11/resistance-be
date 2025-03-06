import { Injectable } from '@nestjs/common';
import { LobbyRepository } from '../repository/lobby.repository';
import { PlayerRepository } from 'src/modules/player/repository/player.repository';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class LobbyService {
  constructor(
    protected lobbyRepository: LobbyRepository,
    protected playerRepository: PlayerRepository,
  ) {}

  async create(data: { name: string }) {
    const roomId = uuidv7();
    const playerId = uuidv7();
    const randomRoom = Math.floor(100000 + Math.random() * 900000);
    await this.lobbyRepository.create({
      id: roomId,
      room_code: randomRoom.toString(),
    });
    return await this.playerRepository.create({
      id: playerId,
      name: data.name,
      lobby_id: roomId,
    });
  }
}
