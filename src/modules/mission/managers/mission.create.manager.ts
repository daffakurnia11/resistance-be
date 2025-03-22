import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { PlayerRepository } from '@src/modules/player/repository/player.repository';
import { MissionDTO, MissionStartDTO } from '../dto/mission.dto';
import { MissionStatusEnum } from '@prisma/client';
import { LobbyLogEvent } from '@src/modules/lobby-log/events/lobby.log.event.handler';
import { LobbyLogAction } from '@src/modules/lobby-log/dto/lobby.log.dto';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class MissionCreateManager {
  constructor(
    @Inject(MISSION_DI)
    protected readonly missionRepo: MissionRepositoryInterface,
    protected readonly playerRepo: PlayerRepository,
    protected readonly eventBus: EventBus,
  ) {}

  async execute(payload: MissionStartDTO) {
    try {
      const record = await this.missionRepo.getOneRelationedByWhere({
        lobby_id: payload.lobby_id,
      });

      if (record) {
        throw new BadRequestException('Lobby is still in progress.');
      }

      this.eventBus.publish(
        new LobbyLogEvent({
          action: LobbyLogAction.START,
          lobby_id: payload.lobby_id,
          player_id: payload.player_id,
        }),
      );

      await this.bulkCreateMission(payload);
      return Promise.resolve(true);
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  protected async bulkCreateMission(payload: MissionStartDTO) {
    let missions = (new Array(5).fill(payload) as MissionDTO[]).map(
      (each, index) => ({
        ...each,
        name: `Mission ${index + 1}`,
        status:
          index === 0
            ? MissionStatusEnum.ASSIGNING
            : (MissionStatusEnum.OPEN as MissionStatusEnum),
      }),
    );

    // assign lead to each mission
    missions = await this.assignRandomLeaderToMissions(payload, missions);

    // create bulk
    const promises = missions.map((each) => this.missionRepo.create(each));
    await Promise.all(promises);
  }

  protected async assignRandomLeaderToMissions(
    payload: MissionStartDTO,
    missions: MissionDTO[],
  ) {
    let players = await this.playerRepo.findManyByWhere({
      lobby_id: payload.lobby_id,
      deleted_at: null,
    });

    return missions.map((each) => {
      if (each.leader_id) {
        players = players.filter((player) => player.id !== each.leader_id);
        return each;
      }

      const randomIndex = Math.floor(Math.random() * players.length);
      const selectedPlayer = players[randomIndex];

      // remove player that has been assigned in the first place.
      players = players.filter((player) => player.id !== selectedPlayer.id);

      return { ...each, leader_id: selectedPlayer.id };
    });
  }
}
