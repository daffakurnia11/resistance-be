-- CreateEnum
CREATE TYPE "MissionStatusEnum" AS ENUM ('OPEN', 'IN_PLAY', 'CLOSE');

-- CreateEnum
CREATE TYPE "MissionVoteEnum" AS ENUM ('APPROVE', 'REJECT');

-- CreateTable
CREATE TABLE "missions" (
    "id" UUID NOT NULL,
    "status" "MissionStatusEnum" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "leader_id" UUID NOT NULL,
    "lobby_id" UUID NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_players" (
    "id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "mission_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "mission_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_votes" (
    "id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "mission_id" UUID NOT NULL,
    "vote" "MissionVoteEnum" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "mission_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_vote_logs" (
    "id" UUID NOT NULL,
    "mission_vote_id" UUID NOT NULL,
    "mission_player_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "mission_vote_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "lobbies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_players" ADD CONSTRAINT "mission_players_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_players" ADD CONSTRAINT "mission_players_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_votes" ADD CONSTRAINT "mission_votes_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_votes" ADD CONSTRAINT "mission_votes_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_vote_logs" ADD CONSTRAINT "mission_vote_logs_mission_vote_id_fkey" FOREIGN KEY ("mission_vote_id") REFERENCES "mission_votes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_vote_logs" ADD CONSTRAINT "mission_vote_logs_mission_player_id_fkey" FOREIGN KEY ("mission_player_id") REFERENCES "mission_players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
