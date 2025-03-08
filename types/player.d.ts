export type PlayerType = {
  name: string;
  lobby_id: string;
  id: string;
  room_role: PlayerRoomRole;
};
export type PlayerRoomRole = 'MASTER' | 'MEMBER';
