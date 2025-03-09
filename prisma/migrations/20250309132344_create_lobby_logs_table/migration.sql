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

-- AddForeignKey
ALTER TABLE "lobby_logs" ADD CONSTRAINT "lobby_logs_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lobby_logs" ADD CONSTRAINT "lobby_logs_lobby_id_fkey" FOREIGN KEY ("lobby_id") REFERENCES "lobbies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
