import {
  Mission,
  MissionEnum,
  MissionStatusEnum,
  Prisma,
} from '@prisma/client';
import { MissionDTO } from '../dto/mission.dto';
import { MissionRelationed } from '../types/mission.type';
import { MissionAssignDTO } from '../dto/mission.assign.dto';
import { MissionVoteDTO } from '../dto/mission.vote.dto';

export interface MissionRepositoryInterface {
  create(payload: MissionDTO): Promise<void>;
  getOneRelationedByWhere(
    where: Prisma.MissionWhereInput,
  ): Promise<MissionRelationed | null>;
  votePlayer(
    missionId: string,
    payload: MissionVoteDTO,
  ): Promise<MissionRelationed>;
  assignPlayers(
    missionId: string,
    payload: MissionAssignDTO,
  ): Promise<MissionRelationed>;
  updateMissionStatus(
    missionId: string,
    status: MissionStatusEnum,
  ): Promise<MissionRelationed>;
  updateMissionResult(
    missionId: string,
    result: MissionEnum,
  ): Promise<MissionRelationed>;
  getManyByWhere(where: Prisma.MissionWhereInput): Promise<Mission[]>;
}
