import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { MissionLogRepositoryInterface } from '../interface/mission.log.repository.interface';
import { MissionLogDTO } from '../dto/mission.log.dto';

@Injectable()
export class MissionLogRepository implements MissionLogRepositoryInterface {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(payload: MissionLogDTO) {
    await this.prismaService.missionLog.create({
      data: {
        mission_id: payload.mission_id,
        player_id: payload.player_id,
        status: payload.status,
      },
    });
  }
}
