import { ApiResponse } from '@nestjs/swagger';

/**
 * 统一响应格式
 */
@ApiResponse({ status: 200, description: '统一响应体' })
export class ResponseDto<T> {
  readonly code: number;
  readonly message: string;
  readonly data: T | null;

  constructor(code: number, message: string, data: T | null = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static success<T>(data: T, message = 'success'): ResponseDto<T> {
    return new ResponseDto(0, message, data);
  }

  static error<T = null>(code: number, message: string): ResponseDto<T> {
    return new ResponseDto(code, message, null);
  }
}

/** 统一响应体类型（供拦截器使用） */
export interface IApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
