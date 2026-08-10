import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { WakeWindowService } from './wake-window.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, WakeWindowService],
})
export class DashboardModule {}
