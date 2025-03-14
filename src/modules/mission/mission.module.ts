import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { MISSION_DI } from './di/mission.di';
import { MissionRepository } from './repository/mission.repository';
import { MissionController } from './controller/mission.controller';
import { MissionService } from './services/mission.service';
import { MissionCreateManager } from './managers/mission.create.manager';
import { PlayerRepository } from '../player/repository/player.repository';

const modules = [PrismaModule, CqrsModule];

const controllers = [MissionController];

const repositories: Provider[] = [
  PlayerRepository,
  { provide: MISSION_DI, useClass: MissionRepository },
];

const services: Provider[] = [MissionService];

const managers = [MissionCreateManager];

const eventHandlers: Provider[] = [];

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
  ],
})
export class MissionModule {}
