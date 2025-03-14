import { Injectable } from '@nestjs/common';
import { MissionDTO } from '../dto/mission.dto';
import { MissionCreateManager } from '../managers/mission.create.manager';

@Injectable()
export class MissionService {
  constructor(protected readonly createManager: MissionCreateManager) {}

  async create(payload: MissionDTO): Promise<void> {
    return await this.createManager.execute(payload);
  }
}
