import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PlayerRepository } from './repository/player.repository';
import { PlayerGateway } from './gateway/player.gateway';
import { PlayerService } from './service/player.service';
import { PlayerController } from './controller/player.controller';
import { LobbyRepository } from '../lobby/repository/lobby.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { LobbyLogModule } from '../lobby-log/lobby.log.module';
import { PlayerRoleGeneratorService } from './service/player.role.generator.service';
import { PlayerJoinManager } from './managers/player.join.manager';
import { PlayerAssignManager } from './managers/player.assign.manager';
import { PlayerLeaveManager } from './managers/player.leave.manager';
import { PlayerKickManager } from './managers/player.kick.manager';
import { PlayerRevealManager } from './managers/player.reveal.manager';
import { PlayerJoinAndUpdateEventHandler } from './events/player.join.and.update.event.handler';

const controllers = [PlayerController];

const managers = [
  PlayerJoinManager,
  PlayerAssignManager,
  PlayerLeaveManager,
  PlayerKickManager,
  PlayerRevealManager,
];

const services = [PlayerService, PlayerRoleGeneratorService];

const repositories = [PlayerRepository, LobbyRepository];

const gateways = [PlayerGateway];

const events = [PlayerJoinAndUpdateEventHandler];

@Module({
  imports: [PrismaModule, CqrsModule, LobbyLogModule],
  controllers: [...controllers],
  providers: [
    ...services,
    ...repositories,
    ...gateways,
    ...events,
    ...managers,
  ],
  exports: [PlayerService, PlayerGateway],
})
export class PlayerModule {}
