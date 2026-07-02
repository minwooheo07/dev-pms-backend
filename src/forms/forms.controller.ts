import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FormsService } from './forms.service';
import { CreateFormTemplateDto, UpdateFormTemplateDto, SubmitFormDto } from './dto/form.dto';

@Controller('projects/:projectId/forms')
@UseGuards(JwtAuthGuard)
export class FormsController {
  constructor(private readonly svc: FormsService) {}

  @Get()
  list(@Param('projectId') projectId: string) {
    return this.svc.list(projectId);
  }

  @Post()
  create(@Param('projectId') projectId: string, @Req() req: any, @Body() dto: CreateFormTemplateDto) {
    return this.svc.create(projectId, req.user.id, dto.name ?? '새 양식');
  }

  @Get(':formId')
  get(@Param('projectId') projectId: string, @Param('formId') formId: string) {
    return this.svc.get(projectId, formId);
  }

  @Put(':formId')
  update(@Param('projectId') projectId: string, @Param('formId') formId: string, @Body() dto: UpdateFormTemplateDto) {
    return this.svc.update(projectId, formId, dto);
  }

  @Delete(':formId')
  remove(@Req() req: any, @Param('projectId') projectId: string, @Param('formId') formId: string) {
    return this.svc.remove(projectId, formId, req.user.id, req.user.role);
  }

  @Post(':formId/submissions')
  submit(@Req() req: any, @Param('projectId') projectId: string, @Param('formId') formId: string, @Body() dto: SubmitFormDto) {
    return this.svc.submit(projectId, formId, req.user.id, dto.data ?? {});
  }

  @Get(':formId/submissions')
  listSubmissions(@Param('projectId') projectId: string, @Param('formId') formId: string) {
    return this.svc.listSubmissions(projectId, formId);
  }

  @Delete(':formId/submissions/:submissionId')
  removeSubmission(
    @Req() req: any,
    @Param('projectId') projectId: string,
    @Param('formId') formId: string,
    @Param('submissionId') submissionId: string,
  ) {
    return this.svc.removeSubmission(projectId, formId, submissionId, req.user.id, req.user.role);
  }
}
