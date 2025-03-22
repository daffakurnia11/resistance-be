/*
  Warnings:

  - Added the required column `updated_at` to the `mission_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mission_logs" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;
