import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BabyService, BabyVo } from './baby.service';
import { BusinessException } from '../../common/exceptions/business.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';
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

  @Post(':id/avatar')
  @ApiOperation({ summary: '上传/更换宝宝头像' })
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BabyVo> {
    if (!file) throw new BusinessException(ErrorCode.PARAM_MISSING, '请上传头像文件');
    return this.babyService.uploadAvatar(id, file.filename);
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
