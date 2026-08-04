import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupplementService, SupplementVo } from './supplement.service';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';
import { QuerySupplementDto } from './dto/query-supplement.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@ApiTags('补剂记录')
@Controller('supplements')
export class SupplementController {
  constructor(private readonly supplementService: SupplementService) {}

  @Post()
  @ApiOperation({ summary: '新增补剂记录' })
  create(@Body() dto: CreateSupplementDto): Promise<SupplementVo> {
    return this.supplementService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '补剂记录列表' })
  findAll(@Query() query: QuerySupplementDto): Promise<PaginatedResult<SupplementVo>> {
    return this.supplementService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '补剂记录详情' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<SupplementVo> {
    return this.supplementService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改补剂记录' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSupplementDto): Promise<SupplementVo> {
    return this.supplementService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除补剂记录' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.supplementService.remove(id);
  }
}
