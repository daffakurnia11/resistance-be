import { Inject, Injectable } from '@nestjs/common';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionVoteDTO } from '../dto/mission.vote.dto';
import { MissionRelationed } from '../types/mission.type';

@Injectable()
export class MissionVoteManager {
  constructor(
    @Inject(MISSION_DI) protected readonly repo: MissionRepositoryInterface,
  ) {}

  async execute(
    missionId: string,
    payload: MissionVoteDTO,
  ): Promise<MissionRelationed> {
    try {
      const result = await this.repo.votePlayer(missionId, payload);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
