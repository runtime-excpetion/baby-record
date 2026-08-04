/**
 * 统一错误码枚举
 * - 0      成功
 * - 1000x  系统级
 * - 2000x  鉴权/身份
 * - 3000x  baby / user 业务
 * - 4000x  参数校验
 * - 5000x  记录类业务
 */
export enum ErrorCode {
  SUCCESS = 0,

  // 系统级
  INTERNAL_ERROR = 10001,
  CONFIG_ERROR = 10002,
  SERVICE_UNAVAILABLE = 10003,

  // 鉴权/身份
  UNAUTHORIZED = 20001,
  IDENTITY_REQUIRED = 20002,

  // baby / user 业务
  BABY_NOT_FOUND = 30001,
  BABY_ALREADY_EXISTS = 30002,
  USER_NOT_FOUND = 30003,

  // 参数校验
  PARAM_INVALID = 40001,
  PARAM_MISSING = 40002,

  // 记录类业务
  RECORD_NOT_FOUND = 50001,
  SLEEP_ALREADY_ENDED = 50002,
  SLEEP_NOT_FOUND = 50003,
  SLEEP_ALREADY_ONGOING = 50004,
}

/** 错误码 -> 默认提示文案 */
export const ErrorMessage: Record<number, string> = {
  [ErrorCode.SUCCESS]: 'success',
  [ErrorCode.INTERNAL_ERROR]: '服务器内部错误',
  [ErrorCode.CONFIG_ERROR]: '配置错误',
  [ErrorCode.SERVICE_UNAVAILABLE]: '服务不可用',
  [ErrorCode.UNAUTHORIZED]: '未授权',
  [ErrorCode.IDENTITY_REQUIRED]: '请先选择记录人身份',
  [ErrorCode.BABY_NOT_FOUND]: '宝宝不存在',
  [ErrorCode.BABY_ALREADY_EXISTS]: '宝宝信息已存在',
  [ErrorCode.USER_NOT_FOUND]: '记录人不存在',
  [ErrorCode.PARAM_INVALID]: '参数校验失败',
  [ErrorCode.PARAM_MISSING]: '缺少必要参数',
  [ErrorCode.RECORD_NOT_FOUND]: '记录不存在',
  [ErrorCode.SLEEP_ALREADY_ENDED]: '该睡眠记录已结束',
  [ErrorCode.SLEEP_NOT_FOUND]: '睡眠记录不存在',
  [ErrorCode.SLEEP_ALREADY_ONGOING]: '已有进行中的睡眠记录',
};
