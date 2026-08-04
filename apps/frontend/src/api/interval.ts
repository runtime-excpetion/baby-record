import { http } from '@/utils/request';
import type { IntervalResult } from '@baby-record/shared';

export const intervalApi = {
  feeding: (babyId: number) => http.get<IntervalResult>('/intervals/feeding', { babyId }),
  diaper: (babyId: number) => http.get<IntervalResult>('/intervals/diaper', { babyId }),
  sleep: (babyId: number) => http.get<IntervalResult>('/intervals/sleep', { babyId }),
};
