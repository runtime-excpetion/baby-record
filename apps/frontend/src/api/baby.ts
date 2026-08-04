import { http } from '@/utils/request';
import type { BabyVo } from '@baby-record/shared';
import type { Gender } from '@baby-record/shared';

export interface CreateBabyPayload {
  name: string;
  nickname?: string;
  gender: Gender;
  birthday: string;
  birthWeight?: number;
  birthHeight?: number;
  headCircumference?: number;
  birthHospital?: string;
  remark?: string;
  avatar?: string;
}

export const babyApi = {
  list: () => http.get<BabyVo[]>('/babies'),
  detail: (id: number) => http.get<BabyVo>(`/babies/${id}`),
  create: (data: CreateBabyPayload) => http.post<BabyVo>('/babies', data),
  update: (id: number, data: Partial<CreateBabyPayload>) => http.patch<BabyVo>(`/babies/${id}`, data),
};
