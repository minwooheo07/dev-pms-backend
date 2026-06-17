import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(q: string) {
    const contains = q;
    const mode = 'insensitive' as const;

    const [tasks, projects] = await Promise.all([
      this.prisma.task.findMany({
        where: {
          parentId: null,
          OR: [
            { title: { contains, mode } },
            { description: { contains, mode } },
          ],
        },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          projectId: true,
          project: { select: { id: true, name: true, color: true, icon: true } },
        },
        take: 10,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.project.findMany({
        where: {
          OR: [
            { name: { contains, mode } },
            { description: { contains, mode } },
          ],
        },
        select: {
          id: true,
          name: true,
          color: true,
          icon: true,
          status: true,
          _count: { select: { tasks: true } },
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    return { tasks, projects };
  }
}
