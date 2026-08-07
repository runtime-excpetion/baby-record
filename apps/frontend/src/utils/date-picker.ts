/** 禁用明天及之后的日历日期，今天仍可选择。 */
export function isFutureDate(timestamp: number): boolean {
  const startOfTomorrow = new Date();
  startOfTomorrow.setHours(24, 0, 0, 0);
  return timestamp >= startOfTomorrow.getTime();
}

/**
 * Naive UI 日期时间选择器的时间禁用规则：
 * 选择今天时，禁用当前时刻之后的小时、分钟和秒。
 */
export function disableFutureTime(timestamp: number) {
  const selected = new Date(timestamp);
  const now = new Date();
  const isToday =
    selected.getFullYear() === now.getFullYear() &&
    selected.getMonth() === now.getMonth() &&
    selected.getDate() === now.getDate();

  if (!isToday) return {};

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  return {
    isHourDisabled: (hour: number) => hour > currentHour,
    isMinuteDisabled: (minute: number, hour: number | null) =>
      hour !== null && (hour > currentHour || (hour === currentHour && minute > currentMinute)),
    isSecondDisabled: (second: number, minute: number | null, hour: number | null) =>
      hour !== null &&
      minute !== null &&
      (hour > currentHour ||
        (hour === currentHour &&
          (minute > currentMinute || (minute === currentMinute && second > currentSecond)))),
  };
}
