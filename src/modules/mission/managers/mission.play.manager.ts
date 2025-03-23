import { Inject, Injectable } from '@nestjs/common';
import { MISSION_PLAYER_DI } from '../di/mission.player.di';
import { MissionPlayerRepositoryInterface } from '../interface/mission.player.repository.interface';
import { MissionPlayDTO } from '../dto/mission.play.dto';
import { EventBus } from '@nestjs/cqrs';
import { MissionLogEvent } from '@src/modules/mission-log/events/lobby.log.event.handler';
import { MissionLogAction } from '@src/modules/mission-log/dto/mission.log.dto';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionEnum, MissionStatusEnum, PlayerRoleEnum } from '@prisma/client';
import {
  MissionPlayerRelationed,
  MissionRelationed,
} from '../types/mission.type';
import { LobbyRepository } from '@src/modules/lobby/repository/lobby.repository';

@Injectable()
export class MissionPlayManager {
  constructor(
    @Inject(MISSION_PLAYER_DI)
    protected readonly repo: MissionPlayerRepositoryInterface,
    @Inject(MISSION_DI)
    protected readonly missionRepo: MissionRepositoryInterface,
    protected readonly lobbyRepo: LobbyRepository,
    protected readonly eventBus: EventBus,
  ) {}

  async execute(
    missionId: string,
    payload: MissionPlayDTO,
  ): Promise<MissionPlayerRelationed | null> {
    try {
      const result = await this.repo.updateState(missionId, payload);

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
      await this.checkAllPlayersState(missionId);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async checkAllPlayersState(missionId: string): Promise<void> {
    const mission = await this.missionRepo.getOneRelationedByWhere({
      id: missionId,
    });
    const missionPlayers = await this.repo.checkAllStates(missionId);
    if (missionPlayers.every((player) => player.state !== null)) {
      await this.updateNextMission(mission!);
      this.eventBus.publish(
        new MissionLogEvent({
          status: MissionLogAction.CLOSED,
          mission_id: missionId,
          player_id: mission!.leader_id,
        }),
      );
      if (missionPlayers.some((player) => player.state === MissionEnum.FAIL)) {
        await this.missionRepo.updateMissionResult(missionId, MissionEnum.FAIL);
      } else {
        await this.missionRepo.updateMissionResult(
          missionId,
          MissionEnum.SUCCESS,
        );
      }
    }
    await this.checkAllMissionState(mission!.lobby_id);
  }

  async checkAllMissionState(lobbyId: string): Promise<void> {
    const missions = await this.missionRepo.getManyByWhere({
      lobby_id: lobbyId,
    });

    // Check if success is above 3
    if (
      missions.filter((mission) => mission.result === MissionEnum.SUCCESS)
        .length >= 3
    ) {
      await this.lobbyRepo.updateWinner(lobbyId, PlayerRoleEnum.RESISTANCE);
    }
    // Check if fail is above 3
    else if (
      missions.filter((mission) => mission.result === MissionEnum.FAIL)
        .length >= 3
    ) {
      await this.lobbyRepo.updateWinner(lobbyId, PlayerRoleEnum.SPY);
    }
  }

  async updateNextMission(mission: MissionRelationed): Promise<void> {
    try {
      const currentMissionNumber = mission.name?.split(' ')[1];
      const nextMissionNumber = parseInt(currentMissionNumber!) + 1;
      const nextMission = await this.missionRepo.getOneRelationedByWhere({
        name: `Mission ${nextMissionNumber}`,
      });

      if (nextMission) {
        await this.missionRepo.updateMissionStatus(
          nextMission.id,
          MissionStatusEnum.ASSIGNING,
        );
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
