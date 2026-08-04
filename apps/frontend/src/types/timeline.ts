import type {
  FeedingVo,
  DiaperVo,
  SleepVo,
  SupplementVo,
  ActivityVo,
} from '@baby-record/shared';

/** 历史时间轴条目（含原始记录，供编辑/删除使用） */
export interface TimelineEntry {
  type: 'feeding' | 'diaper' | 'sleep' | 'supplement' | 'activity';
  raw: FeedingVo | DiaperVo | SleepVo | SupplementVo | ActivityVo;
  time: string;
  icon: string;
  title: string;
  detail: string;
  colorClass: string;
}
