import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionDTO } from '../dto/mission.dto';
import {
  Mission,
  MissionEnum,
  MissionStatusEnum,
  Prisma,
} from '@prisma/client';
import { MissionRelationed } from '../types/mission.type';
import { MissionAssignDTO } from '../dto/mission.assign.dto';
import { MissionVoteDTO } from '../dto/mission.vote.dto';

@Injectable()
export class MissionRepository implements MissionRepositoryInterface {
  constructor(protected readonly prismaService: PrismaService) {}

  protected readonly defaultInclude: Prisma.MissionInclude = {
    leader: true,
    lobby: true,
    mission_players: {
      include: {
        player: true,
      },
      where: {
        deleted_at: null,
      },
    },
    mission_votes: {
      include: {
        player: true,
      },
      where: {
        deleted_at: null,
      },
    },
  };

  async create(payload: MissionDTO) {
    await this.prismaService.mission.create({
      data: {
        name: payload.name,
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
        status: MissionStatusEnum.VOTING,
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
          create: {
            player_id: payload.player_id,
            vote: payload.vote,
          },
        },
      },
    });

    return Promise.resolve(result);
  }

  async updateMissionStatus(
    missionId: string,
    status: MissionStatusEnum,
  ): Promise<MissionRelationed> {
    const result = await this.prismaService.mission.update({
      where: { id: missionId },
      include: this.defaultInclude,
      data: {
        status,
      },
    });

    return Promise.resolve(result);
  }

  async updateMissionResult(
    missionId: string,
    result: MissionEnum,
  ): Promise<MissionRelationed> {
    const data = await this.prismaService.mission.update({
      where: { id: missionId },
      include: this.defaultInclude,
      data: {
        status: MissionStatusEnum.CLOSE,
        result,
      },
    });

    return Promise.resolve(data);
  }

  async getManyByWhere(where: Prisma.MissionWhereInput): Promise<Mission[]> {
    return await this.prismaService.mission.findMany({ where });
  }

  async softDeleteByLobbyId(lobbyId: string): Promise<Prisma.BatchPayload> {
    const results = await this.prismaService.mission.updateMany({
      where: {
        lobby_id: lobbyId,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return Promise.resolve(results);
  }
}
