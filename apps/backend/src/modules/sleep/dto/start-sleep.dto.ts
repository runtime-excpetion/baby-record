import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SleepType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

/**
 * 开始睡眠（创建一条进行中的睡眠记录）
 */
export class StartSleepDto {
  @ApiProperty({ description: '宝宝ID' })
  @Type(() => Number)
  @IsInt()
  babyId: number;

  @ApiPropertyOptional({ enum: SleepType, default: SleepType.DAYTIME, description: '睡眠类型（默认白天）' })
  @IsOptional()
  @IsEnum(SleepType)
  sleepType?: SleepType;

  @ApiPropertyOptional({ description: '开始时间（不传则取当前时间）' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: '记录人ID' })
  @Type(() => Number)
  @IsInt()
  creatorId: number;
}
