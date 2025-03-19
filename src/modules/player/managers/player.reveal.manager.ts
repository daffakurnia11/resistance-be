import { Injectable, NotFoundException } from '@nestjs/common';
import { LobbyRepository } from '../../lobby/repository/lobby.repository';
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

    if (player.role === 'SPY') {
      const teammate = await this.playerRepository
        .findManyByWhere({ lobby_id, role: 'SPY' })
        .then((players) => {
          return players.filter((p) => p.id !== player_id);
        });
      return Promise.resolve({ ...player, teammate });
    }

    return Promise.resolve(player);
  }
}
