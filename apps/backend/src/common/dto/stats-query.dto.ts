import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional } from 'class-validator';

/**
 * 统计/图表通用查询参数：宝宝ID + 时间范围
 */
export class StatsQueryDto {
  @ApiProperty({ description: '宝宝ID' })
  @Type(() => Number)
  @IsInt()
  babyId: number;

  @ApiPropertyOptional({ enum: ['today', '7d', '30d', 'custom'], default: 'today', description: '时间范围' })
  @IsOptional()
  @IsIn(['today', '7d', '30d', 'custom'])
  range?: string = 'today';

  @ApiPropertyOptional({ description: '开始日期（range=custom 时必填）YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: '结束日期（range=custom 时必填）YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
