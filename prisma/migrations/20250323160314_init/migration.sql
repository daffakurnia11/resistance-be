-- CreateEnum
CREATE TYPE "PlayerRoleEnum" AS ENUM ('RESISTANCE', 'SPY');

-- CreateEnum
CREATE TYPE "MissionStatusEnum" AS ENUM ('OPEN', 'ASSIGNING', 'VOTING', 'IN_PLAY', 'CLOSE');

-- CreateEnum
CREATE TYPE "MissionEnum" AS ENUM ('SUCCESS', 'FAIL');

-- CreateEnum
CREATE TYPE "MissionVoteEnum" AS ENUM ('APPROVE', 'REJECT');

-- CreateEnum
CREATE TYPE "RoomRole" AS ENUM ('MASTER', 'MEMBER');

-- CreateTable
CREATE TABLE "lobbies" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "room_code" TEXT NOT NULL,
    "winner" "PlayerRoleEnum",

    CONSTRAINT "lobbies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lobby_logs" (
    "id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "lobby_id" UUID NOT NULL,
    "action" VARCHAR(11) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "lobby_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "role" "PlayerRoleEnum",
    "name" TEXT NOT NULL,
    "lobby_id" UUID,
    "room_role" "RoomRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" UUID NOT NULL,
    "status" "MissionStatusEnum" NOT NULL DEFAULT 'OPEN',
    "result" "MissionEnum",
    "name" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "leader_id" UUID NOT NULL,
    "lobby_id" UUID NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_logs" (
    "id" UUID NOT NULL,
    "status" TEXT,
    "mission_id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "mission_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission_players" (
    "id" UUID NOT NULL,
    "player_id" UUID NOT NULL,
    "mission_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "state" "MissionEnum",

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

-- CreateIndex
CREATE UNIQUE INDEX "lobbies_room_code_key" ON "lobbies"("room_code");

-- AddForeignKey
ALTER TABLE "lobby_logs" ADD CONSTRAINT "lobby_logs_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lobby_logs" ADD CONSTRAINT "lobby_logs_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "lobbies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "lobbies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "lobbies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_logs" ADD CONSTRAINT "mission_logs_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_logs" ADD CONSTRAINT "mission_logs_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
