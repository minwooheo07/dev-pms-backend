import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SheetsService } from './sheets.service';

@Controller('projects/:projectId/sheets')
@UseGuards(JwtAuthGuard)
export class SheetsController {
  constructor(private readonly svc: SheetsService) {}

  @Get()
  list(@Param('projectId') projectId: string) {
    return this.svc.list(projectId);
  }

  @Post()
  create(@Param('projectId') projectId: string, @Req() req: any, @Body('name') name: string, @Body('parentId') parentId?: string) {
    return this.svc.create(projectId, req.user.id, name ?? '새 시트', parentId ?? null);
  }

  // 에디터 하단 탭용: 해당 문서의 페이지 목록 (root + 자식)
  @Get(':sheetId/pages')
  pages(@Param('projectId') projectId: string, @Param('sheetId') sheetId: string) {
    return this.svc.pages(projectId, sheetId);
  }

  @Get(':sheetId')
  get(@Param('projectId') projectId: string, @Param('sheetId') sheetId: string) {
    return this.svc.get(projectId, sheetId);
  }

  @Put(':sheetId')
  save(@Param('projectId') projectId: string, @Param('sheetId') sheetId: string, @Body('data') data: any, @Body('baseUpdatedAt') baseUpdatedAt?: string) {
    return this.svc.save(projectId, sheetId, data, baseUpdatedAt);
  }

  @Put(':sheetId/rename')
  rename(@Req() req: any, @Param('projectId') projectId: string, @Param('sheetId') sheetId: string, @Body('name') name: string) {
    return this.svc.rename(projectId, sheetId, name, req.user.id, req.user.role);
  }

  @Delete(':sheetId')
  remove(@Req() req: any, @Param('projectId') projectId: string, @Param('sheetId') sheetId: string) {
    return this.svc.remove(projectId, sheetId, req.user.id, req.user.role);
  }
}
