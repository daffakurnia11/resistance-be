import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { LobbyModule } from './modules/lobby/lobby.module';
import { PlayerModule } from './modules/player/player.module';
import { LobbyLogModule } from './modules/lobby-log/lobby.log.module';
import { MissionModule } from './modules/mission/mission.module';

@Module({
  imports: [
    PrismaModule,
    LobbyModule,
    PlayerModule,
    MissionModule,
    LobbyLogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
