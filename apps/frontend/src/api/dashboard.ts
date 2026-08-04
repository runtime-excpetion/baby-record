import { http } from '@/utils/request';
import type { DashboardData } from '@baby-record/shared';

export const dashboardApi = {
  overview: (babyId: number) => http.get<DashboardData>('/dashboard', { babyId }),
};
