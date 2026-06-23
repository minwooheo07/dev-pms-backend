import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { QAService } from './qa.service';
import { CreateQATestDto, UpdateQATestDto } from './dto/qa.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('qa')
export class QAController {
  constructor(private readonly qaService: QAService) {}

  @Get()
  findAll(@Query('srNumber') srNumber?: string) {
    return this.qaService.findAll(srNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qaService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateQATestDto) {
    return this.qaService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateQATestDto) {
    return this.qaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qaService.remove(id);
  }
}
