import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LobbyCreateDTO } from '../dto/lobby.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LobbyRepository {
  constructor(protected prismaService: PrismaService) {}

  async create(data: LobbyCreateDTO) {
    return await this.prismaService.lobby.create({
      data: { id: data.id, room_code: data.room_code },
    });
  }

  async getWithPlayer(room_code: string) {
    return await this.prismaService.lobby.findUnique({
      where: { room_code },
      include: { players: { where: { deleted_at: null } } },
    });
  }

  async getWithMission(roomCode: string) {
    return await this.prismaService.lobby.findUnique({
      where: { room_code: roomCode },
      include: {
        missions: {
          include: {
            leader: {
              select: {
                name: true,
                id: true,
                room_role: true,
              },
            },
            lobby: true,
            mission_players: {
              include: {
                player: {
                  select: {
                    name: true,
                    id: true,
                    room_role: true,
                  },
                },
              },
              where: {
                deleted_at: null,
              },
            },
            mission_votes: {
              include: {
                player: {
                  select: {
                    name: true,
                    id: true,
                    room_role: true,
                  },
                },
              },
              where: {
                deleted_at: null,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
    });
  }

  async findOne(room_code: string) {
    return await this.prismaService.lobby.findUniqueOrThrow({
      where: { room_code },
    });
  }

  async findOneByWhere(where: Prisma.LobbyWhereInput) {
    return await this.prismaService.lobby.findFirst({ where });
  }

  async softDelete(id: string) {
    return await this.prismaService.lobby.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
