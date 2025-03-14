import { Injectable, NotFoundException } from '@nestjs/common';
import { LobbyRepository } from '@src/modules/lobby/repository/lobby.repository';
import { PlayerRepository } from '../repository/player.repository';
import { PlayerRevealDTO } from '../dto/player.reveal.dto';

@Injectable()
export class PlayerRevealManager {
  constructor(
    protected readonly lobbyRepository: LobbyRepository,
    protected readonly playerRepository: PlayerRepository,
  ) {}

  async execute(payload: PlayerRevealDTO) {
    const { player_id, lobby_id } = payload;
    const [player, lobby] = await Promise.all([
      this.playerRepository.findOneByWhere({ id: player_id }),
      this.lobbyRepository.findOneByWhere({ id: lobby_id }),
    ]);

    if (!player) {
      throw new NotFoundException('Player not found');
    }
    if (!lobby) {
      throw new NotFoundException('Lobby not found');
    }

    return Promise.resolve(player);
  }
}
