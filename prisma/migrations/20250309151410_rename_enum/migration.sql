/*
  Warnings:

  - The `role` column on the `players` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PlayerRoleEnum" AS ENUM ('RESISTANCE', 'SPY');

-- CreateEnum
CREATE TYPE "MissionEnum" AS ENUM ('SUCCESS', 'FAIL');

-- AlterTable
ALTER TABLE "missions" ADD COLUMN     "result" "MissionEnum";

-- AlterTable
ALTER TABLE "players" DROP COLUMN "role",
ADD COLUMN     "role" "PlayerRoleEnum";

-- DropEnum
DROP TYPE "PlayerRole";
