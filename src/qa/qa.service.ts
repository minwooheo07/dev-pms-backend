import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQATestDto, UpdateQATestDto } from './dto/qa.dto';

@Injectable()
export class QAService {
  constructor(private prisma: PrismaService) {}

  private async generateQANumber(): Promise<string> {
    const year = new Date().getFullYear().toString().slice(-2);
    const prefix = `QA-${year}-`;

    const last = await this.prisma.qATest.findFirst({
      where: { qaNumber: { startsWith: prefix } },
      orderBy: { qaNumber: 'desc' },
    });

    const seq = last
      ? String(parseInt(last.qaNumber.split('-')[2]) + 1).padStart(4, '0')
      : '0001';

    return `${prefix}${seq}`;
  }

  async findAll(srNumber?: string) {
    return this.prisma.qATest.findMany({
      where: srNumber ? { srNumber } : undefined,
      include: { workLog: { select: { id: true, taskTitle: true, srNumber: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.qATest.findUniqueOrThrow({
      where: { id },
      include: { workLog: { select: { id: true, taskTitle: true, srNumber: true } } },
    });
  }

  async create(dto: CreateQATestDto) {
    const qaNumber = await this.generateQANumber();
    return this.prisma.qATest.create({
      data: {
        qaNumber,
        srNumber: dto.srNumber,
        title: dto.title,
        content: dto.content,
        tester: dto.tester,
        testDate: dto.testDate ? new Date(dto.testDate) : undefined,
        workLogId: dto.workLogId,
      },
    });
  }

  async update(id: string, dto: UpdateQATestDto) {
    return this.prisma.qATest.update({
      where: { id },
      data: {
        ...dto,
        testDate: dto.testDate ? new Date(dto.testDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.qATest.delete({ where: { id } });
  }
}
