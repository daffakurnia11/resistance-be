export interface MissionPlayerRepositoryInterface {
  deleteAllPlayers(missionId: string): Promise<void>;
}
