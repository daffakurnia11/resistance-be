import { Injectable } from '@nestjs/common';
import { MissionVoteRepositoryInterface } from '../interface/mission.vote.repository.interface';
import { PrismaService } from '@src/modules/prisma/prisma.service';
import { MissionVoteRelationed } from '../types/mission.type';

@Injectable()
export class MissionVoteRepository implements MissionVoteRepositoryInterface {
  constructor(protected readonly prismaService: PrismaService) {}

  async checkAllVotes(missionId: string): Promise<MissionVoteRelationed[]> {
    return this.prismaService.missionVote.findMany({
      where: {
        mission_id: missionId,
        deleted_at: null,
      },
    });
  }

  async deleteAllVotes(missionId: string): Promise<void> {
    await this.prismaService.missionVote.updateMany({
      where: {
        mission_id: missionId,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
