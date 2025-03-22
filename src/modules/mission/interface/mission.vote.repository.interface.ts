import { MissionVoteRelationed } from '../types/mission.type';

export interface MissionVoteRepositoryInterface {
  checkAllVotes(missionId: string): Promise<MissionVoteRelationed[]>;
  deleteAllVotes(missionId: string): Promise<void>;
}
