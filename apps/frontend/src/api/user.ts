import { http } from '@/utils/request';
import type { UserVo, UserRole } from '@baby-record/shared';

export interface CreateUserPayload {
  name: string;
  role: UserRole;
}

export const userApi = {
  list: () => http.get<UserVo[]>('/users'),
  detail: (id: number) => http.get<UserVo>(`/users/${id}`),
  create: (data: CreateUserPayload) => http.post<UserVo>('/users', data),
  update: (id: number, data: Partial<CreateUserPayload>) => http.patch<UserVo>(`/users/${id}`, data),
};
