import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notices')
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @Get()
  findAll(@Query('projectId') projectId?: string) {
    return this.noticesService.findAll(projectId);
  }

  @Post()
  create(@Req() req: any, @Body() dto: { title: string; content: string; isPinned?: boolean; projectId: string }) {
    return this.noticesService.create(req.user.id, req.user.role, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: { title?: string; content?: string; isPinned?: boolean },
  ) {
    return this.noticesService.update(id, req.user.role, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.noticesService.remove(id, req.user.role);
  }
}
