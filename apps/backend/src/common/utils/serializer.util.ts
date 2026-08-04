import { Prisma } from '@prisma/client';

/**
 * 通用序列化：把 Prisma 返回的 Date -> ISO string，Decimal -> number
 * 用于聚合查询层直接输出原始记录时保持类型一致
 */
export function serialize(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map((i) => serialize(i));
  if (typeof obj === 'object') {
    // Prisma Decimal：用 instanceof 判定。
    // 不能用 constructor.name === 'Decimal'——Prisma 运行时被混淆后类名是 'i' 而非 'Decimal'，
    // 否则 Decimal 会被当成普通对象遍历，输出 { s, e, d } 结构，前端 toFixed 等调用会抛错。
    if (obj instanceof Prisma.Decimal) return Number(obj);
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      result[key] = serialize((obj as Record<string, unknown>)[key]);
    }
    return result;
  }
  return obj;
}
