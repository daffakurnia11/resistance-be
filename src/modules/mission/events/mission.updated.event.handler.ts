import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionGateway } from '../gateways/mission.gateway';

export class MissionUpdatedEvent {
  constructor(public missionId: string) {}
}

@EventsHandler(MissionUpdatedEvent)
export class MissionUpdatedEventHandler
  implements IEventHandler<MissionUpdatedEvent>
{
  constructor(
    @Inject(MISSION_DI)
    protected readonly repo: MissionRepositoryInterface,
    protected readonly missionGateway: MissionGateway,
  ) {}

  async handle(event: MissionUpdatedEvent) {
    const mission = await this.repo.getOneRelationedByWhere({
      id: event.missionId,
    });
    this.missionGateway.server.emit('mission_updated', mission);
  }
}
