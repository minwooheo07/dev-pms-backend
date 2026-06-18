-- CreateTable
CREATE TABLE "CanvasComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "canvasId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CanvasComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CanvasComment" ADD CONSTRAINT "CanvasComment_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "Canvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasComment" ADD CONSTRAINT "CanvasComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
