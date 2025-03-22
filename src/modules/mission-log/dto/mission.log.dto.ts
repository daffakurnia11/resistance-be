export enum MissionLogAction {
  ASSIGNED = 'ASSIGNED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  START = 'START',
  WAITING = 'WAITING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  CLOSED = 'CLOSED',
}

export class MissionLogDTO {
  mission_id: string;
  player_id: string;
  status: MissionLogAction;
}
