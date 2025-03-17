import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MISSION_DI } from '../di/mission.di';
import { MissionRepositoryInterface } from '../interface/mission.repository.interface';
import { MissionRelationed } from '../types/mission.type';

@Injectable()
export class MissionGetOneByIdManager {
  constructor(
    @Inject(MISSION_DI)
    protected readonly repo: MissionRepositoryInterface,
  ) {}

  async execute(roomCode: string): Promise<MissionRelationed> {
    try {
      const result = await this.repo.getOneRelationedByWhere({
        lobby: { room_code: roomCode },
      });

      if (!result) {
        throw new NotFoundException('Lobby is not found!');
      }

      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
