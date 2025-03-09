import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PlayerRepository } from './repository/player.repository';
import { PlayerGateway } from './gateway/player.gateway';
import { PlayerService } from './service/player.service';
import { PlayerController } from './controller/player.controller';
import { LobbyRepository } from '../lobby/repository/lobby.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PlayerController],
  providers: [PlayerRepository, PlayerService, PlayerGateway, LobbyRepository],
  exports: [PlayerService],
})
export class PlayerModule {}
