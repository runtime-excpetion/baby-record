import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SleepService, SleepVo } from './sleep.service';
import { CreateSleepDto } from './dto/create-sleep.dto';
import { UpdateSleepDto } from './dto/update-sleep.dto';
import { StartSleepDto } from './dto/start-sleep.dto';
import { EndSleepDto } from './dto/end-sleep.dto';
import { QuerySleepDto } from './dto/query-sleep.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@ApiTags('睡眠记录')
@Controller('sleeps')
export class SleepController {
  constructor(private readonly sleepService: SleepService) {}

  @Post('start')
  @ApiOperation({ summary: '开始睡觉（创建进行中的睡眠记录）' })
  start(@Body() dto: StartSleepDto): Promise<SleepVo> {
    return this.sleepService.start(dto);
  }

  @Patch(':id/end')
  @ApiOperation({ summary: '结束睡觉（回填结束时间与时长）' })
  end(@Param('id', ParseIntPipe) id: number, @Body() dto: EndSleepDto): Promise<SleepVo> {
    return this.sleepService.end(id, dto);
  }

  @Post()
  @ApiOperation({ summary: '新增睡眠记录（完整录入一段睡眠）' })
  create(@Body() dto: CreateSleepDto): Promise<SleepVo> {
    return this.sleepService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '睡眠记录列表（支持 ongoing 筛选）' })
  findAll(@Query() query: QuerySleepDto): Promise<PaginatedResult<SleepVo>> {
    return this.sleepService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '睡眠记录详情' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SleepVo> {
    return this.sleepService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改睡眠记录' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSleepDto): Promise<SleepVo> {
    return this.sleepService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除睡眠记录' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.sleepService.remove(id);
  }
}
