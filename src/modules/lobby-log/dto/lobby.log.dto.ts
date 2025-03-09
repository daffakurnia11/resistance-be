export enum LobbyLogAction {
  CREATE = 'CREATE',
  JOIN = 'JOIN',
  LEAVE = 'LEAVE',
  KICK = 'KICK',
  DELETE = 'DELETE',
}
export class LobbyLogDTO {
  lobby_id: string;
  player_id: string;
  action: LobbyLogAction;
}
