import { Inject, Injectable } from '@nestjs/common';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionAssignDTO } from '../dto/mission.assign.dto';
import { MissionRelationed } from '../types/mission.type';
import { EventBus } from '@nestjs/cqrs';
import { MissionLogAction } from '@src/modules/mission-log/dto/mission.log.dto';
import { MissionLogEvent } from '@src/modules/mission-log/events/lobby.log.event.handler';

@Injectable()
export class MissionAssignManager {
  constructor(
    @Inject(MISSION_DI)
    protected readonly repo: MissionRepositoryInterface,
    protected readonly eventBus: EventBus,
  ) {}

  async execute(
    missionId: string,
    payload: MissionAssignDTO,
  ): Promise<MissionRelationed> {
    try {
      const result = await this.repo.assignPlayers(missionId, payload);

      this.eventBus.publish(
        new MissionLogEvent({
          status: MissionLogAction.ASSIGNED,
          mission_id: missionId,
          player_id: payload.leader_id,
        }),
      );
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
