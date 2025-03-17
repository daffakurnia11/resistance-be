import {
  Lobby,
  Mission,
  MissionPlayer,
  MissionVote,
  MissionVoteLog,
  Player,
} from '@prisma/client';

export type MissionVoteRelationed = MissionVote & {
  mission_vote_logs?: MissionVoteLog[];
};

export type MissionRelationed = Mission & {
  leader?: Player;
  lobby?: Lobby;
  mission_players?: MissionPlayer[];
  mission_votes?: MissionVoteRelationed[];
};
