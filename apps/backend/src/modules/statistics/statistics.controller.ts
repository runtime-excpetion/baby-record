import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { StatsQueryDto } from '../../common/dto/stats-query.dto';

@ApiTags('统计分析')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  @ApiOperation({ summary: '综合统计（喂养/纸尿裤/睡眠/补剂/成长事件 全部）' })
  overview(@Query() query: StatsQueryDto) {
    return this.statisticsService.overview(query);
  }

  @Get('feeding')
  @ApiOperation({ summary: '喂养统计：次数/总奶量/平均奶量/平均间隔' })
  feeding(@Query() query: StatsQueryDto) {
    return this.statisticsService.feeding(query);
  }

  @Get('diaper')
  @ApiOperation({ summary: '纸尿裤统计：总次数/尿次数/便便次数' })
  diaper(@Query() query: StatsQueryDto) {
    return this.statisticsService.diaper(query);
  }

  @Get('sleep')
  @ApiOperation({ summary: '睡眠统计：总时长/白天/夜间/平均时长' })
  sleep(@Query() query: StatsQueryDto) {
    return this.statisticsService.sleep(query);
  }

  @Get('supplement')
  @ApiOperation({ summary: '补剂统计：次数/类型统计' })
  supplement(@Query() query: StatsQueryDto) {
    return this.statisticsService.supplement(query);
  }

  @Get('activity')
  @ApiOperation({ summary: '成长事件统计：各类型事件数量' })
  activity(@Query() query: StatsQueryDto) {
    return this.statisticsService.activity(query);
  }
}
