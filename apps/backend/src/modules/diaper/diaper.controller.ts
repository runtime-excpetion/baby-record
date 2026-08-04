import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DiaperService, DiaperVo } from './diaper.service';
import { CreateDiaperDto } from './dto/create-diaper.dto';
import { UpdateDiaperDto } from './dto/update-diaper.dto';
import { QueryDiaperDto } from './dto/query-diaper.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@ApiTags('纸尿裤记录')
@Controller('diapers')
export class DiaperController {
  constructor(private readonly diaperService: DiaperService) {}

  @Post()
  @ApiOperation({ summary: '新增纸尿裤记录（快捷换尿布复用此接口）' })
  create(@Body() dto: CreateDiaperDto): Promise<DiaperVo> {
    return this.diaperService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '纸尿裤记录列表' })
  findAll(@Query() query: QueryDiaperDto): Promise<PaginatedResult<DiaperVo>> {
    return this.diaperService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '纸尿裤记录详情' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DiaperVo> {
    return this.diaperService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改纸尿裤记录' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDiaperDto): Promise<DiaperVo> {
    return this.diaperService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除纸尿裤记录' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.diaperService.remove(id);
  }
}
