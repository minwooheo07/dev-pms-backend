-- DropForeignKey
ALTER TABLE "WorkLog" DROP CONSTRAINT "WorkLog_taskId_fkey";

-- AlterTable
ALTER TABLE "WorkLog" ADD COLUMN     "projectName" TEXT,
ADD COLUMN     "taskTitle" TEXT,
ALTER COLUMN "taskId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkLog" ADD CONSTRAINT "WorkLog_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
