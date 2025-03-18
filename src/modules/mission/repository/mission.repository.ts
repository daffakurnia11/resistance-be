import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionDTO } from '../dto/mission.dto';
import { Mission, Prisma } from '@prisma/client';
import { MissionRelationed } from '../types/mission.type';
import { MissionAssignDTO } from '../dto/mission.assign.dto';
import { MissionVoteDTO } from '../dto/mission.vote.dto';

@Injectable()
export class MissionRepository implements MissionRepositoryInterface {
  constructor(protected readonly prismaService: PrismaService) {}

  protected readonly defaultInclude: Prisma.MissionInclude = {
    leader: true,
    lobby: true,
    mission_players: true,
    mission_votes: true,
  };

  async create(payload: MissionDTO) {
    await this.prismaService.mission.create({
      data: {
        leader_id: payload.leader_id,
        lobby_id: payload.lobby_id,
        status: payload.status,
      },
    });
  }

  async getOneRelationedByWhere(
    where: Prisma.MissionWhereInput,
  ): Promise<MissionRelationed | null> {
    const result = await this.prismaService.mission.findFirst({
      where,
      include: this.defaultInclude,
    });

    if (!result) return Promise.resolve(null);

    return Promise.resolve(result);
  }

  async assignPlayers(
    missionId: string,
    payload: MissionAssignDTO,
  ): Promise<MissionRelationed> {
    const result = await this.prismaService.mission.update({
      where: { id: missionId },
      include: this.defaultInclude,
      data: {
        mission_players: {
          createMany: {
            skipDuplicates: true,
            data: payload.player_ids.map((playerId) => ({
              player_id: playerId,
            })),
          },
        },
      },
    });

    return Promise.resolve(result);
  }

  async votePlayer(
    missionId: string,
    payload: MissionVoteDTO,
  ): Promise<MissionRelationed> {
    const result = await this.prismaService.mission.update({
      where: { id: missionId },
      include: this.defaultInclude,
      data: {
        mission_votes: {
          createMany: {
            skipDuplicates: true,
            data: payload.mission_players.map((playerId) => ({
              vote: payload.vote,
              player_id: playerId,
            })),
          },
        },
      },
    });

    return Promise.resolve(result);
  }

  async getManyByWhere(where: Prisma.MissionWhereInput): Promise<Mission[]> {
    return await this.prismaService.mission.findMany({ where });
  }
}
