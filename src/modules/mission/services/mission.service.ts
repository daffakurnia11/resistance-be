import { Inject, Injectable } from '@nestjs/common';
import { MissionDTO } from '../dto/mission.dto';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { PlayerRoleGeneratorService } from '@src/modules/player/service/player.role.generator.service';
import { MissionStatusEnum } from '@prisma/client';
import { PlayerRepository } from '@src/modules/player/repository/player.repository';

@Injectable()
export class MissionService {
  constructor(
    @Inject(MISSION_DI)
    protected readonly missionRepo: MissionRepositoryInterface,
    protected readonly playerRepo: PlayerRepository,
    protected readonly playerRoleGenerator: PlayerRoleGeneratorService,
  ) {}

  async create(payload: MissionDTO): Promise<void> {
    // assign roles
    await this.playerRoleGenerator.execute(payload.lobby_id);

    // create mission
    await this.bulkCreateMission(payload);

    // send to websocket
  }

  protected async bulkCreateMission(payload: MissionDTO) {
    const initialLeaderId = payload.leader_id;
    payload.leader_id = null as never;
    payload.status = MissionStatusEnum.OPEN;

    let missions = new Array(5).fill(payload) as MissionDTO[];

    missions[0].status = MissionStatusEnum.IN_PLAY;
    missions[0].leader_id = initialLeaderId;

    // assign lead to each mission
    missions = await this.assignRandomLeaderToMissions(payload, missions);

    // create bulk
    const promises = missions.map((each) => this.missionRepo.create(each));
    await Promise.all(promises);
  }

  protected async assignRandomLeaderToMissions(
    payload: MissionDTO,
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
