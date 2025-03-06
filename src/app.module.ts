import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { LobbyModule } from './modules/lobby/lobby.module';
import { PlayerModule } from './modules/player/player.module';

@Module({
  imports: [PrismaModule, LobbyModule, PlayerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
