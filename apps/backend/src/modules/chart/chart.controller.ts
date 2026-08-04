import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChartService } from './chart.service';
import { StatsQueryDto } from '../../common/dto/stats-query.dto';

@ApiTags('数据可视化（ECharts）')
@Controller('charts')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get('feeding')
  @ApiOperation({ summary: '喂养趋势图（每日次数 + 总奶量）' })
  feeding(@Query() query: StatsQueryDto) {
    return this.chartService.feeding(query);
  }

  @Get('sleep')
  @ApiOperation({ summary: '睡眠趋势图（每日总睡眠分钟）' })
  sleep(@Query() query: StatsQueryDto) {
    return this.chartService.sleep(query);
  }

  @Get('diaper')
  @ApiOperation({ summary: '纸尿裤趋势图（每日次数）' })
  diaper(@Query() query: StatsQueryDto) {
    return this.chartService.diaper(query);
  }

  @Get('supplement')
  @ApiOperation({ summary: '补剂趋势图（每日次数）' })
  supplement(@Query() query: StatsQueryDto) {
    return this.chartService.supplement(query);
  }
}
