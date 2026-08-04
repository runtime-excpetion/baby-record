/**
 * 前后端共享类型定义
 * 与后端 Prisma schema / DTO / VO 保持一致
 */

// ============ 枚举 ============
export type Gender = 'MALE' | 'FEMALE';
export type UserRole = 'DAD' | 'MOM' | 'GRANDPA_P' | 'GRANDMA_P' | 'GRANDMA_M' | 'GRANDPA_M';
export type FeedingType = 'BREAST_MILK' | 'FORMULA' | 'MIXED';
export type DiaperType = 'PEE' | 'POOP' | 'BOTH';
export type SleepType = 'DAYTIME' | 'NIGHT';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  DAD: '爸爸',
  MOM: '妈妈',
  GRANDPA_P: '爷爷',
  GRANDMA_P: '奶奶',
  GRANDMA_M: '姥姥',
  GRANDPA_M: '姥爷',
};

export const FEEDING_TYPE_LABELS: Record<FeedingType, string> = {
  BREAST_MILK: '母乳',
  FORMULA: '奶粉',
  MIXED: '混合',
};

export const DIAPER_TYPE_LABELS: Record<DiaperType, string> = {
  PEE: '尿',
  POOP: '便便',
  BOTH: '尿+便',
};

export const SLEEP_TYPE_LABELS: Record<SleepType, string> = {
  DAYTIME: '白天',
  NIGHT: '夜间',
};

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: '男',
  FEMALE: '女',
};

export const ALL_USER_ROLES: UserRole[] = ['DAD', 'MOM', 'GRANDPA_P', 'GRANDMA_P', 'GRANDMA_M', 'GRANDPA_M'];
export const ALL_FEEDING_TYPES: FeedingType[] = ['BREAST_MILK', 'FORMULA', 'MIXED'];
export const ALL_DIAPER_TYPES: DiaperType[] = ['PEE', 'POOP', 'BOTH'];

// ============ 年龄 ============
export interface AgeInfo {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  ageText: string;
  monthAgeText: string;
}

// ============ 实体 VO ============
export interface BabyVo {
  id: number;
  name: string;
  nickname: string | null;
  gender: Gender;
  birthday: string;
  birthWeight: number | null;
  birthHeight: number | null;
  headCircumference: number | null;
  birthHospital: string | null;
  remark: string | null;
  createdTime: string;
  updatedTime: string;
  age: AgeInfo;
}

export interface UserVo {
  id: number;
  name: string;
  role: UserRole;
  createdTime: string;
}

export interface FeedingVo {
  id: number;
  babyId: number;
  feedingTime: string;
  feedingType: FeedingType;
  amountMl: number | null;
  durationMinutes: number | null;
  remark: string | null;
  creatorId: number;
  createdTime: string;
}

export interface DiaperVo {
  id: number;
  babyId: number;
  changeTime: string;
  type: DiaperType;
  remark: string | null;
  creatorId: number;
  createdTime: string;
}

export interface SleepVo {
  id: number;
  babyId: number;
  startTime: string;
  endTime: string | null;
  durationMinutes: number | null;
  sleepType: SleepType;
  ongoing: boolean;
  remark: string | null;
  creatorId: number;
  createdTime: string;
}

export interface SupplementVo {
  id: number;
  babyId: number;
  name: string;
  amount: string | null;
  unit: string | null;
  takeTime: string;
  remark: string | null;
  creatorId: number;
  createdTime: string;
}

export interface ActivityVo {
  id: number;
  babyId: number;
  eventType: string;
  eventTime: string;
  description: string | null;
  remark: string | null;
  creatorId: number;
  createdTime: string;
}

// ============ API 通用 ============
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  details?: unknown;
  timestamp?: string;
  path?: string;
}

export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============ Dashboard ============
export interface StatusCard {
  lastTime: string | null;
  minutesSince: number | null;
  text: string | null;
}

export interface DashboardData {
  feeding: StatusCard;
  diaper: StatusCard;
  sleep: StatusCard;
}

// ============ 时间间隔分析 ============
export interface IntervalResult {
  latest: { id: number; time: string } | null;
  previous: { id: number; time: string } | null;
  intervalMinutes: number | null;
  intervalText: string | null;
}

// ============ 统计 ============
export type RangeType = 'today' | '7d' | '30d' | 'custom';

export interface FeedingStats {
  count: number;
  totalAmount: number;
  avgAmount: number;
  avgInterval: number;
  avgIntervalText: string;
}

export interface DiaperStats {
  total: number;
  pee: number;
  poop: number;
}

export interface SleepStats {
  count: number;
  totalMinutes: number;
  totalText: string;
  daytimeMinutes: number;
  daytimeText: string;
  nightMinutes: number;
  nightText: string;
  avgMinutes: number;
  avgText: string;
}

export interface SupplementStats {
  count: number;
  typeStats: { name: string; count: number }[];
}

export interface ActivityStats {
  total: number;
  typeStats: { eventType: string; count: number }[];
}

export interface StatisticsOverview {
  feeding: FeedingStats;
  diaper: DiaperStats;
  sleep: SleepStats;
  supplement: SupplementStats;
  activity: ActivityStats;
}

// ============ 图表 ============
export interface ChartResult {
  xAxis: string[];
  series: { name: string; data: number[] }[];
}

// ============ 聚合记录 ============
export interface DailyRecords {
  feeding: FeedingVo[];
  diaper: DiaperVo[];
  sleep: SleepVo[];
  supplement: SupplementVo[];
  activity: ActivityVo[];
}

// ============ 记录人本地缓存 ============
export interface CurrentUser {
  id: number;
  name: string;
  role: UserRole;
}
