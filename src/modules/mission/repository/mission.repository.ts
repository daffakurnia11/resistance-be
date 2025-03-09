import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionDTO } from '../dto/mission.dto';
import { MissionStatusEnum } from '@prisma/client';

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
}
