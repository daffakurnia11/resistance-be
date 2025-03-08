import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PlayerType } from 'types/player';

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

  async softDelete(id: string) {
    return await this.prismaService.player.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
