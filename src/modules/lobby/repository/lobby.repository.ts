import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LobbyType } from 'types/lobby';

@Injectable()
export class LobbyRepository {
  constructor(protected prismaService: PrismaService) {}

  async create(data: LobbyType) {
    return await this.prismaService.lobby.create({
      data: { id: data.id, room_code: data.room_code },
    });
  }
}
