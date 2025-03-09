import { Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PlayerType, PlayerWithRoleType } from 'types/player';

@Injectable()
export class PlayerRepository {
  constructor(protected prismaService: PrismaService) {}

  async create(data: PlayerType) {
    return await this.prismaService.player.create({
      data: {
        id: data.id,
        name: data.name,
        lobby_id: data.lobby_id,
        room_role: data.room_role,
      },
    });
  }

  async findById(id: string) {
    return await this.prismaService.player.findUnique({
      where: { id },
      select: {
        room_role: true,
      },
    });
  }

  async countPlayerInLobby(lobby_id: string) {
    return await this.prismaService.player.count({
      where: { lobby_id, deleted_at: null },
    });
  }

  async softDelete(id: string) {
    return await this.prismaService.player.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async bulkSoftDelete(lobby_id: string) {
    return await this.prismaService.player.updateMany({
      where: { lobby_id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async findManyByWhere(where: Prisma.PlayerWhereInput): Promise<Player[]> {
    return await this.prismaService.player.findMany({ where });
  }

  async bulkAssignRoles(players: PlayerWithRoleType[]): Promise<void> {
    const promises = players.map((each) =>
      this.prismaService.player.update({
        where: { id: each.id },
        data: { role: each.role },
      }),
    );

    await Promise.all(promises);
  }
}
