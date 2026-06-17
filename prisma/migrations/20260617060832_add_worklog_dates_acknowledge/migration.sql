-- AlterTable
ALTER TABLE "WorkLog" ADD COLUMN     "acknowledgedAt" TIMESTAMP(3),
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isAcknowledged" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDate" TIMESTAMP(3);
