import { http } from '@/utils/request';
import type { ChartResult } from '@baby-record/shared';
import type { StatsParams } from './statistics';

export const chartApi = {
  feeding: (params: StatsParams) => http.get<ChartResult>('/charts/feeding', params),
  sleep: (params: StatsParams) => http.get<ChartResult>('/charts/sleep', params),
  diaper: (params: StatsParams) => http.get<ChartResult>('/charts/diaper', params),
  supplement: (params: StatsParams) => http.get<ChartResult>('/charts/supplement', params),
};
