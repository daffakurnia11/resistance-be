import { Prisma } from '@prisma/client';
import { MissionDTO } from '../dto/mission.dto';
import { MissionRelationed } from '../types/mission.type';

export interface MissionRepositoryInterface {
  create(payload: MissionDTO): Promise<void>;
  getOneRelationedByWhere(
    where: Prisma.MissionWhereInput,
  ): Promise<MissionRelationed | null>;
}
