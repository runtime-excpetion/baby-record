/**
 * 年龄计算工具：根据生日计算 年龄/月龄/天数
 * 算法：满月（completed months）+ 余天（remaining days）
 */

export interface AgeInfo {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  ageText: string; // 例: "0岁4个月2天"
  monthAgeText: string; // 例: "4个月2天"
}

export class AgeUtil {
  static calc(birthday: Date | string, now: Date = new Date()): AgeInfo {
    const birth = birthday instanceof Date ? birthday : new Date(birthday);
    // 仅比较日期（忽略时分秒）
    const b = new Date(birth.getFullYear(), birth.getMonth(), birth.getDate());
    const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let years = n.getFullYear() - b.getFullYear();
    let months = n.getMonth() - b.getMonth();
    let days = n.getDate() - b.getDate();

    if (days < 0) {
      months -= 1;
      // 上一个月的总天数
      const prevMonthDays = new Date(n.getFullYear(), n.getMonth(), 0).getDate();
      days += prevMonthDays;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((n.getTime() - b.getTime()) / 86400000);
    const totalMonths = years * 12 + months;

    return {
      years,
      months,
      days,
      totalDays,
      totalMonths,
      ageText: `${years}岁${months}个月${days}天`,
      monthAgeText: `${totalMonths}个月${days}天`,
    };
  }
}
