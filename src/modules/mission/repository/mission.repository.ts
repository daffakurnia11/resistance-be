import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionDTO } from '../dto/mission.dto';
import { MissionStatusEnum, Prisma } from '@prisma/client';
import { MissionRelationed } from '../types/mission.type';

@Injectable()
export class MissionRepository implements MissionRepositoryInterface {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(payload: MissionDTO) {
    await this.prismaService.mission.create({
      data: {
        leader_id: payload.leader_id,
        lobby_id: payload.lobby_id,
        status: MissionStatusEnum.OPEN,
      },
    });
  }

  async getOneRelationedByWhere(
    where: Prisma.MissionWhereInput,
  ): Promise<MissionRelationed | null> {
    const result = await this.prismaService.mission.findFirst({
      where,
      include: {
        leader: true,
        lobby: true,
        mission_players: true,
        mission_votes: {
          include: {
            mission_vote_logs: true,
          },
        },
      },
    });

    if (!result) return Promise.resolve(null);

    return Promise.resolve(result);
  }
}
