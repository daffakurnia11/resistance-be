import { Injectable } from '@nestjs/common';
import { MissionDTO } from '../dto/mission.dto';
import { MissionCreateManager } from '../managers/mission.create.manager';
import { MissionRelationed } from '../types/mission.type';
import { MissionGetOneByIdManager } from '../managers/mission.get.one.by.id.manager';

@Injectable()
export class MissionService {
  constructor(
    protected readonly createManager: MissionCreateManager,
    protected readonly getOneByIdManager: MissionGetOneByIdManager,
  ) {}

  async create(payload: MissionDTO): Promise<void> {
    return await this.createManager.execute(payload);
  }

  async getOneById(roomCode: string): Promise<MissionRelationed> {
    return await this.getOneByIdManager.execute(roomCode);
  }
}
