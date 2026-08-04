import { createDiscreteApi } from 'naive-ui';

// 全局离散 message 实例，供 API 层与组件直接调用（不依赖组件树 Provider）
const { message } = createDiscreteApi(['message']);

export const $message = message;
