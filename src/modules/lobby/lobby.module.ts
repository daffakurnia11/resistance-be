import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LobbyRepository } from './repository/lobby.repository';
import { LobbyService } from './service/lobby.service';
import { LobbyController } from './controller/lobby.controller';
import { PlayerRepository } from '../player/repository/player.repository';
import { PlayerGateway } from '../player/gateway/player.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [LobbyController],
  providers: [LobbyRepository, LobbyService, PlayerRepository, PlayerGateway],
  exports: [LobbyService],
})
export class LobbyModule {}
