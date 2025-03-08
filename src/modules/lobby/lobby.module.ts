import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LobbyRepository } from './repository/lobby.repository';
import { LobbyService } from './service/lobby.service';
import { LobbyController } from './controller/lobby.controller';
import { PlayerRepository } from '../player/repository/player.repository';
import { LobbyGateway } from './gateway/lobby.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [LobbyController],
  providers: [LobbyRepository, PlayerRepository, LobbyService, LobbyGateway],
  exports: [LobbyService, LobbyGateway],
})
export class LobbyModule {}
