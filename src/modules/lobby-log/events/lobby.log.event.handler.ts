import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LobbyLogService } from '../services/lobby.log.service';
import { LobbyLogDTO } from '../dto/lobby.log.dto';
import { Logger } from '@nestjs/common';

export class LobbyLogEvent extends LobbyLogDTO {
  constructor(payload: LobbyLogDTO) {
    super();
    Object.assign(this, { ...payload });
  }
}

@EventsHandler(LobbyLogEvent)
export class LobbyLogEventHandler implements IEventHandler<LobbyLogEvent> {
  constructor(protected readonly service: LobbyLogService) {}

  protected readonly logger = new Logger(LobbyLogEventHandler.name);

  async handle(event: LobbyLogEvent) {
    this.logger.log(`Triggered log with payload ==> ${JSON.stringify(event)}`);
    await this.service.saveLog(event);
  }
}
