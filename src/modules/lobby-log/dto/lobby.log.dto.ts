export enum LobbyLogAction {
  CREATE = 'CREATE',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
  KICK = 'KICK',
  DELETE = 'DELETE',
  DISBAND = 'DISBAND',
  ASSIGN = 'ASSIGN',
  START = 'START',
  END = 'END',
}
export class LobbyLogDTO {
  lobby_id: string;
  player_id: string;
  action: LobbyLogAction;
}
