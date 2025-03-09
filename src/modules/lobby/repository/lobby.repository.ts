import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LobbyRoomCodeType, LobbyCreateType } from 'types/lobby';

@Injectable()
export class LobbyRepository {
  constructor(protected prismaService: PrismaService) {}

  async create(data: LobbyCreateType) {
    return await this.prismaService.lobby.create({
      data: { id: data.id, room_code: data.room_code },
    });
  }

  async getWithPlayer(data: LobbyRoomCodeType) {
    return await this.prismaService.lobby.findUnique({
      where: { room_code: data.room_code },
      include: { players: { where: { deleted_at: null } } },
    });
  }

  async findOne(data: LobbyRoomCodeType) {
    return await this.prismaService.lobby.findUniqueOrThrow({
      where: { room_code: data.room_code },
    });
  }

  async softDelete(data: { id: string }) {
    return await this.prismaService.lobby.update({
      where: { id: data.id },
      data: { deleted_at: new Date() },
    });
  }
}
