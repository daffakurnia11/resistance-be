import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { MissionPlayerRepositoryInterface } from '../interface/mission.player.repository.interface';

@Injectable()
export class MissionPlayerRepository
  implements MissionPlayerRepositoryInterface
{
  constructor(protected readonly prismaService: PrismaService) {}

  async deleteAllPlayers(missionId: string): Promise<void> {
    await this.prismaService.missionPlayer.updateMany({
      where: {
        mission_id: missionId,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
