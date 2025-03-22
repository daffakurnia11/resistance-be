import { Inject, Injectable } from '@nestjs/common';
import { MISSION_PLAYER_DI } from '../di/mission.player.di';
import { MissionPlayerRepositoryInterface } from '../interface/mission.player.repository.interface';
import { MissionPlayDTO } from '../dto/mission.play.dto';
import { EventBus } from '@nestjs/cqrs';
import { MissionLogEvent } from '@src/modules/mission-log/events/lobby.log.event.handler';
import { MissionLogAction } from '@src/modules/mission-log/dto/mission.log.dto';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionEnum } from '@prisma/client';
import { MissionPlayerRelationed } from '../types/mission.type';

@Injectable()
export class MissionPlayManager {
  constructor(
    @Inject(MISSION_PLAYER_DI)
    protected readonly repo: MissionPlayerRepositoryInterface,
    @Inject(MISSION_DI)
    protected readonly missionRepo: MissionRepositoryInterface,
    protected readonly eventBus: EventBus,
  ) {}

  async execute(
    missionId: string,
    payload: MissionPlayDTO,
  ): Promise<MissionPlayerRelationed | null> {
    try {
      const result = await this.repo.updateState(missionId, payload);
      const mission = await this.missionRepo.getOneRelationedByWhere({
        id: missionId,
      });
      const missionPlayers = await this.repo.checkAllStates(missionId);

      this.eventBus.publish(
        new MissionLogEvent({
          status:
            payload.state === 'SUCCESS'
              ? MissionLogAction.SUCCESS
              : MissionLogAction.FAIL,
          mission_id: missionId,
          player_id: payload.player_id,
        }),
      );

      // Check if all mission players state are not null
      if (missionPlayers.every((player) => player.state !== null)) {
        this.eventBus.publish(
          new MissionLogEvent({
            status: MissionLogAction.CLOSED,
            mission_id: missionId,
            player_id: mission!.leader_id,
          }),
        );
        if (
          missionPlayers.some((player) => player.state === MissionEnum.FAIL)
        ) {
          await this.missionRepo.updateMissionResult(
            missionId,
            MissionEnum.FAIL,
          );
        } else {
          await this.missionRepo.updateMissionResult(
            missionId,
            MissionEnum.SUCCESS,
          );
        }
      }
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
