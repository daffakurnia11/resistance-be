-- CreateEnum
CREATE TYPE "RoomRole" AS ENUM ('MASTER', 'MEMBER');

-- CreateTable
CREATE TABLE "lobbies" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "room_code" TEXT NOT NULL,

    CONSTRAINT "lobbies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "lobby_id" UUID,
    "room_role" "RoomRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lobbies_room_code_key" ON "lobbies"("room_code");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "lobbies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
