import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { MISSION_DI } from './di/mission.di';
import { MissionRepository } from './repository/mission.repository';
import { MissionController } from './controller/mission.controller';
import { MissionService } from './services/mission.service';
import { MissionCreateManager } from './managers/mission.create.manager';
import { PlayerRepository } from '../player/repository/player.repository';
import { MissionGetOneByIdManager } from './managers/mission.get.one.by.id.manager';
import { MissionAssignManager } from './managers/mission.assign.manager';
import { MissionVoteManager } from './managers/mission.vote.manager';
import { MissionResultManager } from './managers/mission.result.manager';
import { MissionGateway } from './gateways/mission.gateway';
import { MissionUpdatedEventHandler } from './events/mission.updated.event.handler';
import { MISSION_VOTE_DI } from '../mission/di/mission.vote.di';
import { MissionVoteRepository } from './repository/mission.vote.repository';
import { MISSION_PLAYER_DI } from './di/mission.player.di';
import { MissionPlayerRepository } from './repository/mission.player.repository';
import { MissionPlayManager } from './managers/mission.play.manager';

const modules = [PrismaModule, CqrsModule];

const controllers = [MissionController];

const repositories: Provider[] = [
  PlayerRepository,
  { provide: MISSION_DI, useClass: MissionRepository },
  { provide: MISSION_VOTE_DI, useClass: MissionVoteRepository },
  { provide: MISSION_PLAYER_DI, useClass: MissionPlayerRepository },
];

const services: Provider[] = [MissionService];

const managers = [
  MissionCreateManager,
  MissionGetOneByIdManager,
  MissionVoteManager,
  MissionAssignManager,
  MissionResultManager,
  MissionPlayManager
];

const eventHandlers: Provider[] = [MissionUpdatedEventHandler];

const gateways: Provider[] = [MissionGateway];
@Module({
  imports: [...modules],
  exports: [...eventHandlers],
  controllers: [...controllers],
  providers: [
    ...controllers,
    ...repositories,
    ...services,
    ...eventHandlers,
    ...managers,
    ...gateways,
  ],
})
export class MissionModule {}
