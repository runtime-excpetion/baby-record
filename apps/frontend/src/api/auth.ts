import { http } from '@/utils/request';

export interface AuthStatus {
  authenticated: boolean;
  expiresIn?: number;
}

export const authApi = {
  status: () => http.get<AuthStatus>('/auth/status'),
  login: (password: string) => http.post<AuthStatus>('/auth/login', { password }),
  logout: () => http.post<AuthStatus>('/auth/logout'),
};
