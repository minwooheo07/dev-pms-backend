-- 시트 2단계 구조: parentId(self-relation) 추가. null=문서(최상위), 값=해당 문서의 페이지
ALTER TABLE "Sheet" ADD COLUMN "parentId" TEXT;

CREATE INDEX "Sheet_parentId_idx" ON "Sheet"("parentId");

ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
