import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorCode } from '../enums/error-code.enum';

/**
 * 统一响应格式拦截器：将返回值包装为 { code, message, data }
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, { code: number; message: string; data: T }> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<{ code: number; message: string; data: T }> {
    return next.handle().pipe(
      map((data) => ({
        code: ErrorCode.SUCCESS,
        message: 'success',
        data: data === undefined ? null : data,
      })),
    );
  }
}
