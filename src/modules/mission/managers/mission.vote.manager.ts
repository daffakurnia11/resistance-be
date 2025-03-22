import { Inject, Injectable } from '@nestjs/common';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionVoteDTO } from '../dto/mission.vote.dto';
import {
  MissionRelationed,
  MissionVoteRelationed,
} from '../types/mission.type';
import { EventBus } from '@nestjs/cqrs';
import { MissionLogEvent } from '@src/modules/mission-log/events/lobby.log.event.handler';
import { MissionLogAction } from '@src/modules/mission-log/dto/mission.log.dto';
import { MissionVoteRepositoryInterface } from '../interface/mission.vote.repository.interface';
import { MISSION_VOTE_DI } from '../di/mission.vote.di';
import { MISSION_PLAYER_DI } from '../di/mission.player.di';
import { MissionPlayerRepositoryInterface } from '../interface/mission.player.repository.interface';

@Injectable()
export class MissionVoteManager {
  constructor(
    @Inject(MISSION_DI) protected readonly repo: MissionRepositoryInterface,
    @Inject(MISSION_VOTE_DI)
    protected readonly missionVoteRepo: MissionVoteRepositoryInterface,
    @Inject(MISSION_PLAYER_DI)
    protected readonly missionPlayerRepo: MissionPlayerRepositoryInterface,
    protected readonly eventBus: EventBus,
  ) {}

  async execute(
    missionId: string,
    payload: MissionVoteDTO,
  ): Promise<MissionRelationed> {
    try {
      const result = await this.repo.votePlayer(missionId, payload);
      const mission = await this.repo.getOneRelationedByWhere({
        id: missionId,
      });
      const missionVotes = await this.checkAllVotes(missionId);
      this.eventBus.publish(
        new MissionLogEvent({
          status:
            payload.vote === 'APPROVE'
              ? MissionLogAction.APPROVED
              : MissionLogAction.REJECTED,
          mission_id: missionId,
          player_id: payload.player_id,
        }),
      );
      if (missionVotes.length === 5) {
        const approvedVotes = missionVotes.filter(
          (vote: MissionVoteRelationed) => vote.vote === 'APPROVE',
        );
        if (approvedVotes.length >= 3) {
          await this.repo.updateMissionStatus(missionId, 'IN_PLAY');
          this.eventBus.publish(
            new MissionLogEvent({
              status: MissionLogAction.START,
              mission_id: missionId,
              player_id: mission!.leader_id,
            }),
          );
        } else {
          await this.missionVoteRepo.deleteAllVotes(missionId);
          await this.missionPlayerRepo.deleteAllPlayers(missionId);
          this.eventBus.publish(
            new MissionLogEvent({
              status: MissionLogAction.REASSIGNING,
              mission_id: missionId,
              player_id: mission!.leader_id,
            }),
          );
          await this.repo.updateMissionStatus(missionId, 'ASSIGNING');
        }
      }
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  protected async checkAllVotes(
    missionId: string,
  ): Promise<MissionVoteRelationed[]> {
    try {
      const result = await this.missionVoteRepo.checkAllVotes(missionId);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
