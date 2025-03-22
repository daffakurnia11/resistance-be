import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { MISSION_LOG_DI } from './di/mission.log.di';
import { MissionLogRepository } from './repository/mission.log.repository';
import { MissionRepository } from '../mission/repository/mission.repository';
import { MissionLogGateway } from './gateway/mission.log.gateway';
import { MissionLogService } from './services/mission.log.service';
import { MissionLogEventHandler } from './events/lobby.log.event.handler';

const modules = [PrismaModule, CqrsModule];

const repositories: Provider[] = [
  { provide: MISSION_LOG_DI, useClass: MissionLogRepository },
  MissionRepository,
];

const services: Provider[] = [MissionLogService];

const eventHandlers: Provider[] = [MissionLogEventHandler, MissionLogGateway];

@Module({
  imports: [...modules],
  exports: [...eventHandlers],
  providers: [...repositories, ...services, ...eventHandlers],
})
export class MissionLogModule {}
