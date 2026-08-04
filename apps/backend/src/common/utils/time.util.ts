/**
 * 时间换算工具
 */
export class TimeUtil {
  /** 分钟数 -> "X小时Y分钟" 文本 */
  static minutesToText(minutes: number): string {
    if (!minutes || minutes < 0) minutes = 0;
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    if (h === 0) return `${m}分钟`;
    if (m === 0) return `${h}小时`;
    return `${h}小时${m}分钟`;
  }

  /** 两个时间点相差的分钟数（from -> to，不小于 0） */
  static minutesBetween(from: Date | string, to: Date = new Date()): number {
    const f = from instanceof Date ? from : new Date(from);
    return Math.max(0, Math.floor((to.getTime() - f.getTime()) / 60000));
  }

  /** 两个时间点相差的分钟数（可正可负，最近-上一次） */
  static minutesDiff(a: Date | string, b: Date | string): number {
    const da = a instanceof Date ? a : new Date(a);
    const db = b instanceof Date ? b : new Date(b);
    return Math.abs(Math.floor((da.getTime() - db.getTime()) / 60000));
  }
}
