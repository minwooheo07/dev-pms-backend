/*
  Warnings:

  - Added the required column `projectId` to the `Notice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notice" ADD COLUMN     "projectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
