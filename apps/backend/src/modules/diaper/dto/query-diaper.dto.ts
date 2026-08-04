import { ApiPropertyOptional } from '@nestjs/swagger';
import { DiaperType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { RecordQueryDto } from '../../../common/dto/record-query.dto';

export class QueryDiaperDto extends RecordQueryDto {
  @ApiPropertyOptional({ enum: DiaperType, description: '类型筛选' })
  @IsOptional()
  @IsEnum(DiaperType)
  type?: DiaperType;
}
