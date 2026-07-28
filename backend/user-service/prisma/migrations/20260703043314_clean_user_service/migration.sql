/*
  Warnings:

  - You are about to drop the column `logoutAt` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `masterUserId` on the `user_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `user_sessions` table. All the data in the column will be lost.
  - Added the required column `userId` to the `user_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_sessions" DROP COLUMN "logoutAt",
DROP COLUMN "masterUserId",
DROP COLUMN "status",
ADD COLUMN     "userId" UUID NOT NULL;
