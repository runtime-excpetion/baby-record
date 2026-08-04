import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { RecordQueryDto } from '../../../common/dto/record-query.dto';

export class QuerySupplementDto extends RecordQueryDto {
  @ApiPropertyOptional({ description: '补剂名称筛选' })
  @IsOptional()
  @IsString()
  name?: string;
}
