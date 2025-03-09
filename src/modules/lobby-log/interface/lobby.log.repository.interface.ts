import { LobbyLogDTO } from '../dto/lobby.log.dto';

export interface LobbyLogRepositoryInterface {
  create(payload: LobbyLogDTO): Promise<void>;
}
