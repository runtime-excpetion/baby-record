/** 当前时间 ISO 字符串（提交后端用） */
export function nowISO(): string {
  return new Date().toISOString();
}

/** ISO/timestamp/Date -> HH:mm */
export function fmtTime(t: string | number | Date | null | undefined): string {
  if (t === null || t === undefined || t === '') return '';
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** ISO/timestamp/Date -> YYYY-MM-DD */
export function fmtDate(t: string | number | Date | null | undefined): string {
  if (t === null || t === undefined || t === '') return '';
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** ISO/timestamp/Date -> YYYY-MM-DD HH:mm */
export function fmtDateTime(t: string | number | Date | null | undefined): string {
  if (!t) return '';
  return `${fmtDate(t)} ${fmtTime(t)}`;
}

/** 分钟数 -> "X小时Y分钟" */
export function minutesToText(minutes: number): string {
  if (!minutes || minutes < 0) return '0分钟';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}分钟`;
  if (m === 0) return `${h}小时`;
  return `${h}小时${m}分钟`;
}

/** from -> to(now) 相差分钟数 */
export function minutesSince(from: string | number | Date, to: Date = new Date()): number {
  return Math.max(0, Math.floor((to.getTime() - new Date(from).getTime()) / 60000));
}
