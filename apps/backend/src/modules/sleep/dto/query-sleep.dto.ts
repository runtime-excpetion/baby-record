import { ApiPropertyOptional } from '@nestjs/swagger';
import { SleepType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { RecordQueryDto } from '../../../common/dto/record-query.dto';

export class QuerySleepDto extends RecordQueryDto {
  @ApiPropertyOptional({ enum: SleepType, description: '睡眠类型筛选' })
  @IsOptional()
  @IsEnum(SleepType)
  sleepType?: SleepType;

  @ApiPropertyOptional({ description: '是否进行中（true=未结束，false=已结束）' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  ongoing?: boolean;
}
