import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessage } from '../enums/error-code.enum';

/**
 * 业务异常：携带统一错误码，由 AllExceptionsFilter 转换为标准响应体
 */
export class BusinessException extends HttpException {
  private readonly errorCode: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string, httpStatus: HttpStatus = HttpStatus.OK) {
    const msg = message || ErrorMessage[errorCode] || '业务异常';
    super({ code: errorCode, message: msg, data: null }, httpStatus);
    this.errorCode = errorCode;
  }

  getErrorCode(): ErrorCode {
    return this.errorCode;
  }
}
