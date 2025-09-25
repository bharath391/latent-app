/*
  Warnings:

  - Added the required column `lastUpdateBy` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "lastUpdateBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_lastUpdateBy_fkey" FOREIGN KEY ("lastUpdateBy") REFERENCES "public"."Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
