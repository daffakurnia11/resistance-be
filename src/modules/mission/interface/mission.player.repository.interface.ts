import { MissionPlayDTO } from '../dto/mission.play.dto';
import { MissionPlayerRelationed } from '../types/mission.type';

export interface MissionPlayerRepositoryInterface {
  checkAllStates(missionId: string): Promise<MissionPlayerRelationed[]>;
  deleteAllPlayers(missionId: string): Promise<void>;
  updateState(
    missionId: string,
    payload: MissionPlayDTO,
  ): Promise<MissionPlayerRelationed | null>;
}
