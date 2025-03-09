import { Module, Provider } from '@nestjs/common';
import { LOBBY_LOG_DI } from './di/lobby.log.di';
import { LobbyLogRepository } from './repository/lobby.log.repository';
import { LobbyLogService } from './services/lobby.log.service';
import { LobbyLogEventHandler } from './events/lobby.log.event.handler';
import { PrismaModule } from '../prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';

const modules = [PrismaModule, CqrsModule];

const repositories: Provider[] = [
  { provide: LOBBY_LOG_DI, useClass: LobbyLogRepository },
];

const services: Provider[] = [LobbyLogService];

const eventHandlers: Provider[] = [LobbyLogEventHandler];

@Module({
  imports: [...modules],
  exports: [...eventHandlers],
  providers: [...repositories, ...services, ...eventHandlers],
})
export class LobbyLogModule {}
