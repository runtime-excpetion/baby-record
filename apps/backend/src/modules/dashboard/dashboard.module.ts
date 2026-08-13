import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { WakeWindowService } from './wake-window.service';
import { FeedingGuideService } from './feeding-guide.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, WakeWindowService, FeedingGuideService],
})
export class DashboardModule {}
