import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PlayerRepository } from '../repository/player.repository';
import { Player, PlayerRoleEnum } from '@prisma/client';
import { PlayerWithRoleType } from 'types/player';

@Injectable()
export class PlayerRoleGeneratorService {
  constructor(protected readonly repository: PlayerRepository) {}

  protected readonly logger = new Logger(PlayerRoleGeneratorService.name);

  async execute(lobbyId: string): Promise<void> {
    const players: Player[] = await this.repository.findManyByWhere({
      lobby_id: lobbyId,
      deleted_at: null,
    });
    if (!players.length) {
      this.logger.log(`No players found in lobby ${lobbyId}.`);
      throw new BadRequestException(`No players found in lobby ${lobbyId}`);
    }

    if (players.length < 5) {
      this.logger.log(`Minimum 5 players in lobby ${lobbyId}`);
      throw new BadRequestException(`Minimum 5 players in lobby ${lobbyId}`);
    }

    const generateRandomIndices = (length: number): number[] => {
      const indices = Array.from({ length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return indices;
    };

    const randomIndices = generateRandomIndices(players.length);
    const sortedPlayer: (Player & { index: number })[] = this.sort(
      players,
      randomIndices,
    );

    const playerWithRoles = this.defineRoles(sortedPlayer);

    await this.repository.bulkAssignRoles(playerWithRoles);
  }

  protected sort(
    players: Player[],
    randomIndices: number[],
  ): (Player & { index: number })[] {
    const sorted = players.sort((prev, next) => prev.id.localeCompare(next.id));

    return sorted.map((player, index) => ({
      ...player,
      index: randomIndices[index],
    }));
  }

  protected defineRoles(
    players: (Player & { index: number })[],
  ): PlayerWithRoleType[] {
    return players.map((each) => ({
      ...each,
      role:
        each.index % 2 === 1 ? PlayerRoleEnum.SPY : PlayerRoleEnum.RESISTANCE,
    }));
  }
}
