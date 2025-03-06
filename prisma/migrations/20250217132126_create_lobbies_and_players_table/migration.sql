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

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "lobbies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
