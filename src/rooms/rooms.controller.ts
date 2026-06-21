import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards, Sse, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoomsService } from './rooms.service';
import { RoomsSseService } from './rooms-sse.service';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private sseService: RoomsSseService,
    private prisma: PrismaService,
  ) {}

  // 내 룸 목록
  @Get()
  myRooms(@Req() req: any) {
    return this.roomsService.myRooms(req.user.id);
  }

  // 룸 생성
  @Post()
  create(@Req() req: any, @Body() body: { name: string; memberIds: string[] }) {
    return this.roomsService.create(req.user.id, body.name, body.memberIds ?? []);
  }

  // 룸 메시지 조회
  @Get(':roomId/messages')
  messages(@Param('roomId') roomId: string, @Req() req: any) {
    return this.roomsService.messages(roomId, req.user.id);
  }

  // 메시지 전송
  @Post(':roomId/messages')
  async send(@Param('roomId') roomId: string, @Req() req: any, @Body('content') content: string) {
    const msg = await this.roomsService.send(roomId, req.user.id, content);
    this.sseService.emit({
      roomId,
      senderId: req.user.id,
      senderName: msg.sender.name,
      content,
    });
    return msg;
  }

  // 멤버 추가
  @Post(':roomId/members')
  addMember(@Param('roomId') roomId: string, @Req() req: any, @Body('userId') userId: string) {
    return this.roomsService.addMember(roomId, req.user.id, userId);
  }

  // 룸 이름 변경
  @Patch(':roomId/name')
  rename(@Param('roomId') roomId: string, @Req() req: any, @Body('name') name: string) {
    return this.roomsService.rename(roomId, req.user.id, name);
  }

  // 룸 나가기
  @Delete(':roomId/members/me')
  leave(@Param('roomId') roomId: string, @Req() req: any) {
    return this.roomsService.leave(roomId, req.user.id);
  }

  // SSE — 내가 속한 룸들의 실시간 이벤트
  @Sse('events')
  @UseGuards()
  async events(@Req() req: any, @Query('token') token: string): Promise<Observable<any>> {
    let userId = req.user?.id;
    if (!userId && token) {
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = payload.sub;
      } catch {}
    }
    const members = await this.prisma.roomMember.findMany({
      where: { userId },
      select: { roomId: true },
    });
    const roomIds = members.map((m) => m.roomId);
    return this.sseService.stream(userId, roomIds) as Observable<any>;
  }
}
