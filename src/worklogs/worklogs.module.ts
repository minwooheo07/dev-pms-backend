import { Module } from '@nestjs/common';
import { WorkLogsService } from './worklogs.service';
import { WorkLogsController } from './worklogs.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  providers: [WorkLogsService],
  controllers: [WorkLogsController],
})
export class WorkLogsModule {}
