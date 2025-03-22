import { Inject, Injectable } from '@nestjs/common';
import { LobbyLogDTO } from '../dto/lobby.log.dto';
import { LOBBY_LOG_DI } from '../di/lobby.log.di';
import { LobbyLogRepositoryInterface } from '../interface/lobby.log.repository.interface';
import { LobbyLogGateway } from '../gateway/lobby.log.gateway';

@Injectable()
export class LobbyLogService {
  constructor(
    @Inject(LOBBY_LOG_DI)
    protected readonly repository: LobbyLogRepositoryInterface,
    protected readonly lobbyLogGateway: LobbyLogGateway,
  ) {}

  async saveLog(payload: LobbyLogDTO): Promise<void> {
    this.lobbyLogGateway.server.emit('lobby_log', payload);
    await this.repository.create(payload);
  }
}
