import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('首页仪表盘')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: '首页状态卡片：距离上次喂养/换纸尿裤/睡眠' })
  @ApiQuery({ name: 'babyId', required: true, type: Number })
  overview(@Query('babyId', ParseIntPipe) babyId: number) {
    return this.dashboardService.overview(babyId);
  }
}
