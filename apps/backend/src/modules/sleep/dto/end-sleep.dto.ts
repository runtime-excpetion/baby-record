import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

/**
 * 结束睡眠（回填结束时间与时长）
 */
export class EndSleepDto {
  @ApiPropertyOptional({ description: '结束时间（不传则取当前时间）' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ description: '备注（覆盖原备注）' })
  @IsOptional()
  @IsString()
  remark?: string;
}
