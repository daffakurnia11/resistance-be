-- CreateEnum
CREATE TYPE "PlayerRole" AS ENUM ('RESISTANCE', 'SPY');

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "role" "PlayerRole";
