import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface WakeWindowConfig {
  minMonth: number;
  maxMonth: number;
  recommendedWakeMinutes: number;
  maxWakeMinutes: number;
}

@Injectable()
export class WakeWindowService {
  private readonly logger = new Logger(WakeWindowService.name);
  private readonly windows: WakeWindowConfig[];

  constructor() {
    const path = join(__dirname, '../../config/wake-windows.json');
    this.windows = JSON.parse(readFileSync(path, 'utf8')) as WakeWindowConfig[];
    this.validate();
    this.logger.log(`已加载 ${this.windows.length} 组清醒窗口配置`);
  }

  findByAgeMonths(ageMonths: number): WakeWindowConfig {
    const match = this.windows.find((item) => ageMonths >= item.minMonth && ageMonths <= item.maxMonth);
    // 超过配置年龄时沿用最后一档，仅作参考，避免页面完全失去提示。
    return match ?? this.windows[this.windows.length - 1];
  }

  private validate() {
    if (!this.windows.length) throw new Error('清醒窗口配置不能为空');
    for (const [index, item] of this.windows.entries()) {
      if (
        !Number.isInteger(item.minMonth) ||
        !Number.isInteger(item.maxMonth) ||
        item.minMonth < 0 ||
        item.maxMonth < item.minMonth ||
        item.recommendedWakeMinutes <= 0 ||
        item.maxWakeMinutes <= item.recommendedWakeMinutes
      ) {
        throw new Error(`清醒窗口配置非法: ${JSON.stringify(item)}`);
      }
      const expectedMinMonth = index === 0 ? 0 : this.windows[index - 1].maxMonth + 1;
      if (item.minMonth !== expectedMinMonth) {
        throw new Error(`清醒窗口配置存在重叠或缺口: ${JSON.stringify(item)}`);
      }
    }
  }
}
