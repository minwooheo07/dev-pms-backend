import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const NOTICE_SELECT = {
  id: true,
  title: true,
  content: true,
  isPinned: true,
  createdAt: true,
  updatedAt: true,
  projectId: true,
  project: { select: { id: true, name: true, color: true } },
  createdBy: { select: { id: true, name: true, avatar: true } },
};

@Injectable()
export class NoticesService {
  constructor(private prisma: PrismaService) {}

  async findAll(projectId?: string) {
    return this.prisma.notice.findMany({
      where: projectId ? { projectId } : undefined,
      select: NOTICE_SELECT,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: string, userRole: string, dto: { title: string; content: string; isPinned?: boolean; projectId: string }) {
    if (userRole !== 'ADMIN') throw new ForbiddenException('관리자만 공지사항을 등록할 수 있습니다.');
    return this.prisma.notice.create({
      data: {
        title: dto.title,
        content: dto.content,
        isPinned: dto.isPinned ?? false,
        projectId: dto.projectId,
        createdById: userId,
      },
      select: NOTICE_SELECT,
    });
  }

  async update(noticeId: string, userRole: string, dto: { title?: string; content?: string; isPinned?: boolean }) {
    if (userRole !== 'ADMIN') throw new ForbiddenException('관리자만 공지사항을 수정할 수 있습니다.');
    const notice = await this.prisma.notice.findUnique({ where: { id: noticeId } });
    if (!notice) throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    return this.prisma.notice.update({
      where: { id: noticeId },
      data: dto,
      select: NOTICE_SELECT,
    });
  }

  async remove(noticeId: string, userRole: string) {
    if (userRole !== 'ADMIN') throw new ForbiddenException('관리자만 공지사항을 삭제할 수 있습니다.');
    const notice = await this.prisma.notice.findUnique({ where: { id: noticeId } });
    if (!notice) throw new NotFoundException('공지사항을 찾을 수 없습니다.');
    await this.prisma.notice.delete({ where: { id: noticeId } });
    return { message: '공지사항이 삭제되었습니다.' };
  }
}
