import { Injectable } from '@nestjs/common';
import { MissionDTO } from '../dto/mission.dto';
import { MissionCreateManager } from '../managers/mission.create.manager';
import { MissionRelationed } from '../types/mission.type';
import { MissionGetOneByIdManager } from '../managers/mission.get.one.by.id.manager';
import { MissionVoteDTO } from '../dto/mission.vote.dto';
import { MissionVoteManager } from '../managers/mission.vote.manager';
import { MissionAssignDTO } from '../dto/mission.assign.dto';
import { MissionAssignManager } from '../managers/mission.assign.manager';
import { MissionResultManager } from '../managers/mission.result.manager';

@Injectable()
export class MissionService {
  constructor(
    protected readonly createManager: MissionCreateManager,
    protected readonly getOneByIdManager: MissionGetOneByIdManager,
    protected readonly assignManager: MissionAssignManager,
    protected readonly voteManager: MissionVoteManager,
    protected readonly resultManager: MissionResultManager,
  ) {}

  async create(payload: MissionDTO): Promise<boolean> {
    return await this.createManager.execute(payload);
  }

  async getOneByRoomCode(roomCode: string): Promise<MissionRelationed> {
    return await this.getOneByIdManager.execute({
      lobby: { room_code: roomCode },
    });
  }

  async getOneById(missionId: string): Promise<MissionRelationed> {
    return await this.getOneByIdManager.execute({ id: missionId });
  }

  async getResult(missionId: string) {
    return await this.resultManager.execute(missionId);
  }

  async assignPlayers(
    missionId: string,
    payload: MissionAssignDTO,
  ): Promise<MissionRelationed> {
    return await this.assignManager.execute(missionId, payload);
  }

  async vote(
    missionId: string,
    payload: MissionVoteDTO,
  ): Promise<MissionRelationed> {
    return await this.voteManager.execute(missionId, payload);
  }
}
