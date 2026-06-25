import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SheetsService {
  constructor(private prisma: PrismaService) {}

  async list(projectId: string) {
    return this.prisma.sheet.findMany({
      where: { projectId },
      select: {
        id: true, name: true, order: true, createdAt: true, updatedAt: true,
        createdBy: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { order: 'asc' },
    });
  }

  async create(projectId: string, userId: string, name: string) {
    const last = await this.prisma.sheet.findFirst({
      where: { projectId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    return this.prisma.sheet.create({
      data: { projectId, createdById: userId, name, order: (last?.order ?? -1) + 1 },
      select: { id: true, name: true, order: true, createdAt: true, updatedAt: true },
    });
  }

  async get(projectId: string, sheetId: string) {
    const sheet = await this.prisma.sheet.findFirst({ where: { id: sheetId, projectId } });
    if (!sheet) throw new NotFoundException('시트를 찾을 수 없습니다.');
    return sheet;
  }

  async save(projectId: string, sheetId: string, data: any, baseUpdatedAt?: string) {
    const sheet = await this.prisma.sheet.findFirst({ where: { id: sheetId, projectId } });
    if (!sheet) throw new NotFoundException('시트를 찾을 수 없습니다.');

    // 낙관적 락: 클라이언트가 마지막으로 본 버전과 현재 DB 버전이 같을 때만 저장(원자적 비교·갱신)
    if (baseUpdatedAt) {
      const res = await this.prisma.sheet.updateMany({
        where: { id: sheetId, projectId, updatedAt: new Date(baseUpdatedAt) },
        data: { data },
      });
      if (res.count === 0) {
        const latest = await this.prisma.sheet.findFirst({ where: { id: sheetId, projectId } });
        throw new ConflictException({ message: '다른 사용자가 먼저 수정했습니다.', latest });
      }
      return this.prisma.sheet.findFirst({ where: { id: sheetId, projectId } });
    }

    return this.prisma.sheet.update({ where: { id: sheetId }, data: { data } });
  }

  // 이름변경·삭제는 등록자 또는 관리자만 가능
  private async assertOwnerOrAdmin(sheetId: string, userId: string, userRole?: string) {
    const sheet = await this.prisma.sheet.findUnique({ where: { id: sheetId }, select: { createdById: true } });
    if (!sheet) throw new NotFoundException('시트를 찾을 수 없습니다.');
    if (userRole !== 'ADMIN' && sheet.createdById !== userId) {
      throw new ForbiddenException('등록자 또는 관리자만 가능합니다.');
    }
  }

  async rename(projectId: string, sheetId: string, name: string, userId: string, userRole?: string) {
    await this.assertOwnerOrAdmin(sheetId, userId, userRole);
    return this.prisma.sheet.update({ where: { id: sheetId }, data: { name } });
  }

  async remove(projectId: string, sheetId: string, userId: string, userRole?: string) {
    await this.assertOwnerOrAdmin(sheetId, userId, userRole);
    await this.prisma.sheet.deleteMany({ where: { id: sheetId, projectId } });
  }

  async reorder(projectId: string, ids: string[]) {
    await Promise.all(
      ids.map((id, order) => this.prisma.sheet.update({ where: { id }, data: { order } })),
    );
  }
}
