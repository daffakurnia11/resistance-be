-- AlterTable
ALTER TABLE "missions" ADD COLUMN     "name" VARCHAR(255);

-- CreateTable
CREATE TABLE "mission_logs" (
    "id" UUID NOT NULL,
    "status" TEXT,
    "mission_id" UUID NOT NULL,
    "player_id" UUID NOT NULL,

    CONSTRAINT "mission_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mission_logs" ADD CONSTRAINT "mission_logs_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_logs" ADD CONSTRAINT "mission_logs_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
