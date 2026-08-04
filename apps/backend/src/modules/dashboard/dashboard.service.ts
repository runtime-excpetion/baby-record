import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TimeUtil } from '../../common/utils/time.util';

export interface StatusCard {
  lastTime: string | null;
  minutesSince: number | null;
  text: string | null;
}

/**
 * 首页仪表盘：三张状态卡片（距离上次 喂养/换纸尿裤/睡眠）
 */
@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(babyId: number) {
    const [lastFeeding, lastDiaper, lastSleep, latestTemperature] = await Promise.all([
      this.prisma.feeding.findFirst({ where: { babyId }, orderBy: { feedingTime: 'desc' } }),
      this.prisma.diaper.findFirst({ where: { babyId }, orderBy: { changeTime: 'desc' } }),
      this.prisma.sleep.findFirst({ where: { babyId }, orderBy: { startTime: 'desc' } }),
      this.prisma.temperature.findFirst({ where: { babyId }, orderBy: { measureTime: 'desc' } }),
    ]);

    return {
      feeding: this.card(lastFeeding?.feedingTime),
      diaper: this.card(lastDiaper?.changeTime),
      sleep: this.card(lastSleep?.startTime),
      latestTemperature: latestTemperature
        ? { temperature: Number(latestTemperature.temperature), measureTime: latestTemperature.measureTime.toISOString() }
        : null,
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
