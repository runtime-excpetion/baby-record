import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TimeUtil } from '../../common/utils/time.util';
import { AgeUtil } from '../../common/utils/age.util';
import { BusinessException } from '../../common/exceptions/business.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { WakeWindowService } from './wake-window.service';

export interface StatusCard {
  lastTime: string | null;
  minutesSince: number | null;
  text: string | null;
}

export const WAKE_WINDOW_SOURCE = 'https://health.choc.org/babies-and-sleep-the-ultimate-guide/';

/**
 * 首页仪表盘：三张状态卡片（距离上次 喂养/换纸尿裤/睡眠）
 */
@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wakeWindows: WakeWindowService,
  ) {}

  async overview(babyId: number) {
    const now = new Date();
    const [baby, lastFeeding, lastDiaper, lastSleep, latestTemperature] = await Promise.all([
      this.prisma.baby.findUnique({ where: { id: babyId }, select: { birthday: true } }),
      this.prisma.feeding.findFirst({ where: { babyId, feedingTime: { lte: now } }, orderBy: { feedingTime: 'desc' } }),
      this.prisma.diaper.findFirst({ where: { babyId, changeTime: { lte: now } }, orderBy: { changeTime: 'desc' } }),
      this.prisma.sleep.findFirst({ where: { babyId, startTime: { lte: now } }, orderBy: { startTime: 'desc' } }),
      this.prisma.temperature.findFirst({ where: { babyId, measureTime: { lte: now } }, orderBy: { measureTime: 'desc' } }),
    ]);

    if (!baby) throw new BusinessException(ErrorCode.BABY_NOT_FOUND);
    const ageMonths = AgeUtil.calc(baby.birthday, now).totalMonths;
    const window = this.wakeWindows.findByAgeMonths(ageMonths);

    return {
      feeding: this.card(lastFeeding?.feedingTime),
      diaper: this.card(lastDiaper?.changeTime),
      // 睡眠间隔起点：已结束取 endTime，进行中（endTime 为 null）回退取 startTime
      sleep: this.card(lastSleep ? (lastSleep.endTime ?? lastSleep.startTime) : null),
      wakePrediction: this.wakePrediction(lastSleep, ageMonths, window),
      latestTemperature: latestTemperature
        ? { temperature: Number(latestTemperature.temperature), measureTime: latestTemperature.measureTime.toISOString() }
        : null,
    };
  }

  private wakePrediction(
    lastSleep: { startTime: Date; endTime: Date | null } | null,
    ageMonths: number,
    window: { recommendedWakeMinutes: number; maxWakeMinutes: number },
  ) {
    const lastWakeTime = lastSleep?.endTime ?? null;
    const midpointMinutes = Math.round((window.recommendedWakeMinutes + window.maxWakeMinutes) / 2);
    return {
      isSleeping: Boolean(lastSleep && !lastSleep.endTime),
      lastWakeTime: lastWakeTime?.toISOString() ?? null,
      sleepWindowStart: lastWakeTime
        ? new Date(lastWakeTime.getTime() + window.recommendedWakeMinutes * 60_000).toISOString()
        : null,
      recommendedSleepTime: lastWakeTime
        ? new Date(lastWakeTime.getTime() + midpointMinutes * 60_000).toISOString()
        : null,
      maxAwakeUntil: lastWakeTime
        ? new Date(lastWakeTime.getTime() + window.maxWakeMinutes * 60_000).toISOString()
        : null,
      recommendedWakeMinutes: window.recommendedWakeMinutes,
      maxWakeMinutes: window.maxWakeMinutes,
      ageMonths,
      sourceUrl: WAKE_WINDOW_SOURCE,
    };
  }

  private card(time: Date | undefined | null): StatusCard {
    if (!time) {
      return { lastTime: null, minutesSince: null, text: null };
    }
    const minutes = TimeUtil.minutesBetween(time);
    return {
      lastTime: time.toISOString(),
      minutesSince: minutes,
      text: TimeUtil.minutesToText(minutes),
    };
  }
}
