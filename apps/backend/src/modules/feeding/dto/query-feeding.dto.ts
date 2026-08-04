import { ApiPropertyOptional } from '@nestjs/swagger';
import { FeedingType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { RecordQueryDto } from '../../../common/dto/record-query.dto';

export class QueryFeedingDto extends RecordQueryDto {
  @ApiPropertyOptional({ enum: FeedingType, description: '喂养类型筛选' })
  @IsOptional()
  @IsEnum(FeedingType)
  feedingType?: FeedingType;
}
