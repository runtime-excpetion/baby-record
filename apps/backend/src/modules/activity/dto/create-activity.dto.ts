import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ description: '宝宝ID' })
  @Type(() => Number)
  @IsInt()
  babyId: number;

  @ApiProperty({ example: '抬头', description: '事件类型（玩耍/抬头/翻身/洗澡/练习坐/其他）' })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty({ example: '2026-08-03T15:00:00.000Z', description: '事件时间' })
  @IsDateString()
  eventTime: string;

  @ApiPropertyOptional({ example: '今天能抬头坚持10秒', description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;

  @ApiProperty({ description: '记录人ID' })
  @Type(() => Number)
  @IsInt()
  creatorId: number;
}
