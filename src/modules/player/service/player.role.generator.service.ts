import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PlayerRepository } from '../repository/player.repository';
import { Player, PlayerRoleEnum } from '@prisma/client';
import { PlayerWithRoleType } from 'types/player';

@Injectable()
export class PlayerRoleGeneratorService {
  constructor(protected readonly repository: PlayerRepository) {}

  protected readonly logger = new Logger(PlayerRoleGeneratorService.name);

  async execute(lobbyId: string): Promise<void> {
    let players = await this.repository.findManyByWhere({
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

    players = this.sort(players);

    const playerWithRoles = this.defineRoles(players);

    await this.repository.bulkAssignRoles(playerWithRoles);
  }

  protected sort(players: Player[]): Player[] {
    return players.sort((prev, next) => prev.id.localeCompare(next.id));
  }

  protected defineRoles(players: Player[]): PlayerWithRoleType[] {
    return players.map((each, index) => ({
      ...each,
      role: index % 2 === 0 ? PlayerRoleEnum.SPY : PlayerRoleEnum.RESISTANCE,
    }));
  }
}
