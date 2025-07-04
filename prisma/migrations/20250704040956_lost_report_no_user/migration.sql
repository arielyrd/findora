/*
  Warnings:

  - You are about to drop the column `userId` on the `LostReport` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `LostReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `LostReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nim` to the `LostReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `LostReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LostReport" DROP CONSTRAINT "LostReport_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "LostReport" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "nim" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";
