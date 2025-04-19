/*
  Warnings:

  - You are about to drop the column `multiplier` on the `Setting` table. All the data in the column will be lost.
  - Added the required column `multiplierR` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `multiplierS` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `multiplierT` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Setting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "multiplier",
ADD COLUMN     "multiplierR" INTEGER NOT NULL,
ADD COLUMN     "multiplierS" INTEGER NOT NULL,
ADD COLUMN     "multiplierT" INTEGER NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
