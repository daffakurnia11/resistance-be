import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { Mission, MissionEnum, PlayerRoleEnum } from '@prisma/client';

@Injectable()
export class MissionResultManager {
  private readonly REQUIRED_MISSIONS = 5;
  private readonly FAIL_THRESHOLD = 3;

  constructor(
    @Inject(MISSION_DI)
    protected readonly repo: MissionRepositoryInterface,
  ) {}

  async execute(missionId: string): Promise<PlayerRoleEnum> {
    const missions = await this.fetchMissionResults(missionId);
    this.validateMissionsComplete(missions);

    const totalFails = this.countFailedMissions(missions);
    return this.determineWinner(totalFails);
  }

  private async fetchMissionResults(missionId: string): Promise<Mission[]> {
    try {
      return await this.repo.getManyByWhere({
        id: missionId,
        result: { not: null },
      });
    } catch (err) {
      throw new BadRequestException('Failed to fetch mission results');
    }
  }

  private validateMissionsComplete(missions: Mission[]) {
    if (missions.length !== this.REQUIRED_MISSIONS) {
      throw new BadRequestException('Mission is not completed!');
    }
  }

  private countFailedMissions(missions: Mission[]): number {
    return missions.reduce(
      (fails, mission) =>
        mission.result === MissionEnum.FAIL ? fails + 1 : fails,
      0,
    );
  }

  private determineWinner(totalFails: number): PlayerRoleEnum {
    return totalFails >= this.FAIL_THRESHOLD
      ? PlayerRoleEnum.SPY
      : PlayerRoleEnum.RESISTANCE;
  }
}
