import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LobbyLogDTO } from '../dto/lobby.log.dto';
import { LobbyLogRepositoryInterface } from '../interface/lobby.log.repository.interface';

@Injectable()
export class LobbyLogRepository implements LobbyLogRepositoryInterface {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(payload: LobbyLogDTO) {
    await this.prismaService.lobbyLog.create({
      data: {
        lobby_id: payload.lobby_id,
        player_id: payload.player_id,
        action: payload.action,
        created_at: new Date(),
      },
    });
  }
}
