import { MissionDTO } from '../dto/mission.dto';

export interface MissionRepositoryInterface {
  create(payload: MissionDTO): Promise<void>;
}
