import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { RecordQueryDto } from '../../../common/dto/record-query.dto';

export class QueryActivityDto extends RecordQueryDto {
  @ApiPropertyOptional({ description: '事件类型筛选' })
  @IsOptional()
  @IsString()
  eventType?: string;
}
