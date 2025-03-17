import { Inject, Injectable } from '@nestjs/common';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionAssignDTO } from '../dto/mission.assign.dto';
import { MissionRelationed } from '../types/mission.type';

@Injectable()
export class MissionAssignManager {
  constructor(
    @Inject(MISSION_DI)
    protected readonly repo: MissionRepositoryInterface,
  ) {}

  async execute(
    missionId: string,
    payload: MissionAssignDTO,
  ): Promise<MissionRelationed> {
    try {
      const result = await this.repo.assignPlayers(missionId, payload);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
