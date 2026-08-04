import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { $message } from './feedback';
import type { ApiResponse } from '@baby-record/shared';

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
});

// 请求拦截
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error),
);

// 响应拦截：统一拆包 { code, message, data }
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const res = response.data;
    if (res.code === 0) {
      return res.data as unknown as AxiosResponse;
    }
    // 业务错误
    $message.error(res.message || '请求失败');
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    const msg = error?.response?.data?.message || error?.message || '网络异常，请稍后重试';
    $message.error(msg);
    return Promise.reject(error);
  },
);

/** 统一 HTTP 调用封装，直接返回业务 data */
export const http = {
  get<T>(url: string, params?: object): Promise<T> {
    return instance.get(url, { params }) as unknown as Promise<T>;
  },
  post<T>(url: string, data?: object): Promise<T> {
    return instance.post(url, data) as unknown as Promise<T>;
  },
  patch<T>(url: string, data?: object): Promise<T> {
    return instance.patch(url, data) as unknown as Promise<T>;
  },
  put<T>(url: string, data?: object): Promise<T> {
    return instance.put(url, data) as unknown as Promise<T>;
  },
  delete<T>(url: string): Promise<T> {
    return instance.delete(url) as unknown as Promise<T>;
  },
};

export type { AxiosRequestConfig };
