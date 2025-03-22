import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { MissionPlayerRepositoryInterface } from '../interface/mission.player.repository.interface';
import { MissionPlayDTO } from '../dto/mission.play.dto';
import { MissionPlayerRelationed } from '../types/mission.type';

@Injectable()
export class MissionPlayerRepository
  implements MissionPlayerRepositoryInterface
{
  constructor(protected readonly prismaService: PrismaService) {}

  async checkAllStates(missionId: string): Promise<MissionPlayerRelationed[]> {
    return this.prismaService.missionPlayer.findMany({
      where: {
        mission_id: missionId,
      },
    });
  }

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

  async updateState(
    missionId: string,
    payload: MissionPlayDTO,
  ): Promise<MissionPlayerRelationed | null> {
    const missionPlayer = await this.prismaService.missionPlayer.findFirst({
      where: {
        mission_id: missionId,
        player_id: payload.player_id,
      },
      select: { id: true },
    });

    if (!missionPlayer) return null;

    return this.prismaService.missionPlayer.update({
      where: { id: missionPlayer.id },
      data: { state: payload.state },
    });
  }
}
