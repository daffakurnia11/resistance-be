import { Inject, Injectable } from '@nestjs/common';
import { MISSION_LOG_DI } from '../di/mission.log.di';
import { MissionLogRepositoryInterface } from '../interface/mission.log.repository.interface';
import { MissionLogGateway } from '../gateway/mission.log.gateway';
import { MissionLogDTO } from '../dto/mission.log.dto';

@Injectable()
export class MissionLogService {
  constructor(
    @Inject(MISSION_LOG_DI)
    protected readonly repository: MissionLogRepositoryInterface,
    protected readonly missionLogGateway: MissionLogGateway,
  ) {}

  async saveLog(payload: MissionLogDTO): Promise<void> {
    this.missionLogGateway.server.emit('mission_log', payload);
    await this.repository.create(payload);
  }
}
