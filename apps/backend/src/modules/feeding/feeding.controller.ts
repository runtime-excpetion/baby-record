import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeedingService, FeedingVo } from './feeding.service';
import { CreateFeedingDto } from './dto/create-feeding.dto';
import { UpdateFeedingDto } from './dto/update-feeding.dto';
import { QueryFeedingDto } from './dto/query-feeding.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@ApiTags('喂养记录')
@Controller('feedings')
export class FeedingController {
  constructor(private readonly feedingService: FeedingService) {}

  @Post()
  @ApiOperation({ summary: '新增喂养记录（快捷喂养复用此接口）' })
  create(@Body() dto: CreateFeedingDto): Promise<FeedingVo> {
    return this.feedingService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '喂养记录列表（支持宝宝/时间范围/类型筛选）' })
  findAll(@Query() query: QueryFeedingDto): Promise<PaginatedResult<FeedingVo>> {
    return this.feedingService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '喂养记录详情' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FeedingVo> {
    return this.feedingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改喂养记录' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFeedingDto): Promise<FeedingVo> {
    return this.feedingService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除喂养记录' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.feedingService.remove(id);
  }
}
