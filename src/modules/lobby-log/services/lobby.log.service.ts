import { Inject, Injectable } from '@nestjs/common';
import { LobbyLogDTO } from '../dto/lobby.log.dto';
import { LOBBY_LOG_DI } from '../di/lobby.log.di';
import { LobbyLogRepositoryInterface } from '../interface/lobby.log.repository.interface';

@Injectable()
export class LobbyLogService {
  constructor(
    @Inject(LOBBY_LOG_DI)
    protected readonly repository: LobbyLogRepositoryInterface,
  ) {}

  async saveLog(payload: LobbyLogDTO): Promise<void> {
    await this.repository.create(payload);
  }
}
