import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { MissionLogDTO } from '../dto/mission.log.dto';
import { MissionLogService } from '../services/mission.log.service';

export class MissionLogEvent extends MissionLogDTO {
  constructor(payload: MissionLogDTO) {
    super();
    Object.assign(this, { ...payload });
  }
}

@EventsHandler(MissionLogEvent)
export class MissionLogEventHandler implements IEventHandler<MissionLogEvent> {
  constructor(protected readonly service: MissionLogService) {}

  protected readonly logger = new Logger(MissionLogEventHandler.name);

  async handle(event: MissionLogEvent) {
    this.logger.log(`Triggered log with payload ==> ${JSON.stringify(event)}`);
    await this.service.saveLog(event);
  }
}
