import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WbsService } from './wbs.service';
import { CreateWbsItemDto, UpdateWbsItemDto, ReorderWbsDto, BulkCreateWbsDto } from './wbs.dto';

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/wbs')
export class WbsController {
  constructor(private readonly wbsService: WbsService) {}

  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.wbsService.findAll(projectId);
  }

  @Post()
  create(@Param('projectId') projectId: string, @Body() dto: CreateWbsItemDto) {
    return this.wbsService.create(projectId, dto);
  }

  @Post('bulk')
  bulkCreate(@Param('projectId') projectId: string, @Body() dto: BulkCreateWbsDto) {
    return this.wbsService.bulkCreate(projectId, dto);
  }

  @Patch('reorder')
  reorder(@Param('projectId') projectId: string, @Body() dto: ReorderWbsDto) {
    return this.wbsService.reorder(projectId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWbsItemDto) {
    return this.wbsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wbsService.remove(id);
  }
}
