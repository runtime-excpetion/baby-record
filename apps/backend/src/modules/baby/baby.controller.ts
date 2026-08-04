import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BabyService, BabyVo } from './baby.service';
import { CreateBabyDto } from './dto/create-baby.dto';
import { UpdateBabyDto } from './dto/update-baby.dto';

@ApiTags('宝宝基础信息')
@Controller('babies')
export class BabyController {
  constructor(private readonly babyService: BabyService) {}

  @Post()
  @ApiOperation({ summary: '新增宝宝' })
  create(@Body() dto: CreateBabyDto): Promise<BabyVo> {
    return this.babyService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改宝宝信息' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBabyDto): Promise<BabyVo> {
    return this.babyService.update(id, dto);
  }

  @Get()
  @ApiOperation({ summary: '宝宝列表' })
  findAll(): Promise<BabyVo[]> {
    return this.babyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '宝宝详情（含年龄/月龄/天数计算）' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<BabyVo> {
    return this.babyService.findOne(id);
  }
}
