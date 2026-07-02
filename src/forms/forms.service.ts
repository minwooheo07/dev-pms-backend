import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async list(projectId: string) {
    return this.prisma.formTemplate.findMany({
      where: { projectId },
      select: {
        id: true, name: true, description: true, createdAt: true, updatedAt: true,
        createdBy: { select: { id: true, name: true, avatar: true } },
        _count: { select: { submissions: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(projectId: string, userId: string, name: string) {
    return this.prisma.formTemplate.create({
      data: { projectId, createdById: userId, name, schema: [] },
    });
  }

  async get(projectId: string, formId: string) {
    const form = await this.prisma.formTemplate.findFirst({ where: { id: formId, projectId } });
    if (!form) throw new NotFoundException('양식을 찾을 수 없습니다.');
    return form;
  }

  async update(projectId: string, formId: string, data: { name?: string; description?: string; schema?: any[] }) {
    const form = await this.prisma.formTemplate.findFirst({ where: { id: formId, projectId } });
    if (!form) throw new NotFoundException('양식을 찾을 수 없습니다.');
    return this.prisma.formTemplate.update({ where: { id: formId }, data });
  }

  private async assertOwnerOrAdmin(formId: string, userId: string, userRole?: string) {
    const form = await this.prisma.formTemplate.findUnique({ where: { id: formId }, select: { createdById: true } });
    if (!form) throw new NotFoundException('양식을 찾을 수 없습니다.');
    if (userRole !== 'ADMIN' && form.createdById !== userId) {
      throw new ForbiddenException('등록자 또는 관리자만 가능합니다.');
    }
  }

  async remove(projectId: string, formId: string, userId: string, userRole?: string) {
    await this.assertOwnerOrAdmin(formId, userId, userRole);
    await this.prisma.formTemplate.deleteMany({ where: { id: formId, projectId } });
  }

  // ── 제출 ──────────────────────────────────────────────
  async submit(projectId: string, formId: string, userId: string, data: Record<string, any>) {
    const form = await this.prisma.formTemplate.findFirst({ where: { id: formId, projectId } });
    if (!form) throw new NotFoundException('양식을 찾을 수 없습니다.');
    return this.prisma.formSubmission.create({
      data: { templateId: formId, submittedById: userId, data: data ?? {} },
    });
  }

  async listSubmissions(projectId: string, formId: string) {
    const form = await this.prisma.formTemplate.findFirst({ where: { id: formId, projectId } });
    if (!form) throw new NotFoundException('양식을 찾을 수 없습니다.');
    return this.prisma.formSubmission.findMany({
      where: { templateId: formId },
      select: {
        id: true, data: true, createdAt: true,
        submittedBy: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeSubmission(projectId: string, formId: string, submissionId: string, userId: string, userRole?: string) {
    const sub = await this.prisma.formSubmission.findFirst({ where: { id: submissionId, templateId: formId } });
    if (!sub) throw new NotFoundException('제출 데이터를 찾을 수 없습니다.');
    if (userRole !== 'ADMIN' && sub.submittedById !== userId) {
      throw new ForbiddenException('제출자 또는 관리자만 가능합니다.');
    }
    await this.prisma.formSubmission.deleteMany({ where: { id: submissionId, templateId: formId } });
  }
}
