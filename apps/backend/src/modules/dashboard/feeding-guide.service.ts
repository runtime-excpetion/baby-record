import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface FeedingGuideConfig {
  minMonth: number;
  maxMonth: number;
  /** 建议喂养间隔（分钟），用于推算下次喂养时间 */
  recommendedIntervalMinutes: number;
  minIntervalMinutes: number;
  maxIntervalMinutes: number;
  /** 单次建议奶量范围（ml）；月龄较大的档位为空，以每日总量为准 */
  perFeedMinMl: number | null;
  perFeedMaxMl: number | null;
  dailyAmountMl: number | null;
  feedingCount: number;
}

@Injectable()
export class FeedingGuideService {
  private readonly logger = new Logger(FeedingGuideService.name);
  private readonly guides: FeedingGuideConfig[];

  constructor() {
    const path = join(__dirname, '../../config/feeding-guide.json');
    this.guides = JSON.parse(readFileSync(path, 'utf8')) as FeedingGuideConfig[];
    this.validate();
    this.logger.log(`已加载 ${this.guides.length} 组喂养建议配置`);
  }

  findByAgeMonths(ageMonths: number): FeedingGuideConfig {
    const match = this.guides.find((item) => ageMonths >= item.minMonth && ageMonths <= item.maxMonth);
    // 超过配置年龄时沿用最后一档，仅作参考，避免页面完全失去提示。
    return match ?? this.guides[this.guides.length - 1];
  }

  private validate() {
    if (!this.guides.length) throw new Error('喂养建议配置不能为空');
    for (const [index, item] of this.guides.entries()) {
      if (
        !Number.isInteger(item.minMonth) ||
        !Number.isInteger(item.maxMonth) ||
        item.minMonth < 0 ||
        item.maxMonth < item.minMonth ||
        item.recommendedIntervalMinutes <= 0 ||
        item.minIntervalMinutes <= 0 ||
        item.maxIntervalMinutes < item.minIntervalMinutes ||
        item.feedingCount <= 0
      ) {
        throw new Error(`喂养建议配置非法: ${JSON.stringify(item)}`);
      }
      // 奶量范围要么都为空，要么都非空且区间合法
      if (
        (item.perFeedMinMl === null) !== (item.perFeedMaxMl === null) ||
        (item.perFeedMinMl !== null && item.perFeedMaxMl !== null && item.perFeedMaxMl < item.perFeedMinMl)
      ) {
        throw new Error(`喂养建议奶量范围非法: ${JSON.stringify(item)}`);
      }
      const expectedMinMonth = index === 0 ? 0 : this.guides[index - 1].maxMonth + 1;
      if (item.minMonth !== expectedMinMonth) {
        throw new Error(`喂养建议配置存在重叠或缺口: ${JSON.stringify(item)}`);
      }
    }
  }
}
