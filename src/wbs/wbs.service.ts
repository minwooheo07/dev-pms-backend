import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWbsItemDto, UpdateWbsItemDto, ReorderWbsDto, BulkCreateWbsDto } from './wbs.dto';

@Injectable()
export class WbsService {
  constructor(private prisma: PrismaService) {}

  async findAll(projectId: string) {
    return this.prisma.wbsItem.findMany({
      where: { projectId },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async create(projectId: string, dto: CreateWbsItemDto) {
    const count = await this.prisma.wbsItem.count({ where: { projectId } });
    return this.prisma.wbsItem.create({
      data: {
        title: dto.title,
        assignee: dto.assignee,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        progress: dto.progress ?? 0,
        note: dto.note,
        order: dto.order ?? count,
        depth: dto.depth ?? 0,
        projectId,
        parentId: dto.parentId ?? null,
      },
    });
  }

  async update(id: string, dto: UpdateWbsItemDto) {
    const item = await this.prisma.wbsItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException();
    return this.prisma.wbsItem.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.assignee !== undefined && { assignee: dto.assignee || null }),
        ...(dto.startDate !== undefined && { startDate: dto.startDate ? new Date(dto.startDate) : null }),
        ...(dto.endDate !== undefined && { endDate: dto.endDate ? new Date(dto.endDate) : null }),
        ...(dto.progress !== undefined && { progress: dto.progress }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.note !== undefined && { note: dto.note || null }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.depth !== undefined && { depth: dto.depth }),
        ...(dto.parentId !== undefined && { parentId: dto.parentId ?? null }),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.wbsItem.delete({ where: { id } });
  }

  async bulkCreate(projectId: string, dto: BulkCreateWbsDto) {
    const startOrder = await this.prisma.wbsItem.count({ where: { projectId } });
    // depth별 마지막 생성 항목 추적 → parentId 자동 연결
    const lastAtDepth = new Map<number, string>();

    const created: any[] = [];
    for (let i = 0; i < dto.items.length; i++) {
      const item = dto.items[i];
      const depth = item.depth ?? 0;
      const parentId = depth > 0 ? (lastAtDepth.get(depth - 1) ?? null) : null;
      const record = await this.prisma.wbsItem.create({
        data: {
          title: item.title,
          assignee: item.assignee,
          startDate: item.startDate ? new Date(item.startDate) : undefined,
          endDate: item.endDate ? new Date(item.endDate) : undefined,
          progress: item.progress ?? 0,
          status: item.status,
          note: item.note,
          order: startOrder + i,
          depth,
          projectId,
          parentId,
        },
      });
      lastAtDepth.set(depth, record.id);
      // 더 깊은 depth의 참조 초기화 (형제 노드가 나오면 이전 자식 참조 삭제)
      for (const [d] of lastAtDepth) {
        if (d > depth) lastAtDepth.delete(d);
      }
      created.push(record);
    }
    return { count: created.length };
  }

  async reorder(projectId: string, dto: ReorderWbsDto) {
    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.wbsItem.update({
          where: { id: item.id },
          data: { order: item.order, parentId: item.parentId, depth: item.depth },
        }),
      ),
    );
    return this.findAll(projectId);
  }
}
