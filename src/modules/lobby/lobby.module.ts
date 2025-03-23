import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LobbyRepository } from './repository/lobby.repository';
import { LobbyService } from './service/lobby.service';
import { LobbyController } from './controller/lobby.controller';
import { PlayerRepository } from '../player/repository/player.repository';
import { PlayerGateway } from '../player/gateway/player.gateway';
import { CqrsModule } from '@nestjs/cqrs';
import { LobbyLogModule } from '../lobby-log/lobby.log.module';
import { MissionRepository } from '../mission/repository/mission.repository';

@Module({
  imports: [PrismaModule, CqrsModule, LobbyLogModule],
  controllers: [LobbyController],
  providers: [
    LobbyRepository,
    LobbyService,
    PlayerRepository,
    PlayerGateway,
    MissionRepository,
  ],
  exports: [LobbyService],
})
export class LobbyModule {}
