import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { MISSION_DI } from './di/mission.di';
import { MissionRepository } from './repository/mission.repository';

const modules = [PrismaModule, CqrsModule];

const repositories: Provider[] = [
  { provide: MISSION_DI, useClass: MissionRepository },
];

const services: Provider[] = [];

const eventHandlers: Provider[] = [];

@Module({
  imports: [...modules],
  exports: [...eventHandlers],
  providers: [...repositories, ...services, ...eventHandlers],
})
export class LobbyLogModule {}
