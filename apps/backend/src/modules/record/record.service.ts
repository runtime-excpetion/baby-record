import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DateRangeUtil } from '../../common/utils/date-range.util';
import { serialize } from '../../common/utils/serializer.util';
import { BusinessException } from '../../common/exceptions/business.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';

/**
 * 聚合查询：按天 / 按范围返回全部类型记录
 */
@Injectable()
export class RecordService {
  constructor(private readonly prisma: PrismaService) {}

  /** 查询某天全部记录 */
  async findDaily(babyId: number, date: string) {
    if (!date) throw new BusinessException(ErrorCode.PARAM_MISSING, 'date 不能为空');
    const { start, end } = DateRangeUtil.day(date);
    return this.collect(babyId, start, end);
  }

  /** 查询时间范围内全部记录 */
  async findRange(babyId: number, startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      throw new BusinessException(ErrorCode.PARAM_MISSING, 'startDate 与 endDate 不能为空');
    }
    const range = DateRangeUtil.resolve('custom', startDate, endDate);
    return this.collect(babyId, range.start, range.end);
  }

  private async collect(babyId: number, start: Date, end: Date) {
    const [feeding, diaper, sleep, supplement, activity] = await Promise.all([
      this.prisma.feeding.findMany({ where: { babyId, feedingTime: { gte: start, lte: end } }, orderBy: { feedingTime: 'desc' } }),
      this.prisma.diaper.findMany({ where: { babyId, changeTime: { gte: start, lte: end } }, orderBy: { changeTime: 'desc' } }),
      this.prisma.sleep.findMany({ where: { babyId, startTime: { gte: start, lte: end } }, orderBy: { startTime: 'desc' } }),
      this.prisma.supplement.findMany({ where: { babyId, takeTime: { gte: start, lte: end } }, orderBy: { takeTime: 'desc' } }),
      this.prisma.activity.findMany({ where: { babyId, eventTime: { gte: start, lte: end } }, orderBy: { eventTime: 'desc' } }),
    ]);
    return {
      feeding: serialize(feeding),
      diaper: serialize(diaper),
      sleep: serialize(sleep),
      supplement: serialize(supplement),
      activity: serialize(activity),
    };
  }
}
