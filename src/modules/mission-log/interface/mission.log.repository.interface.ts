import { MissionLogDTO } from '../dto/mission.log.dto';

export interface MissionLogRepositoryInterface {
  create(payload: MissionLogDTO): Promise<void>;
}
