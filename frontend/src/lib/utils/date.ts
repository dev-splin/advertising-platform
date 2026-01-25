import { format, addDays, parseISO } from 'date-fns';

/**
 * 날짜 유틸리티
 */

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * 날짜에 일수를 더한 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function addDaysToDate(date: Date | string, days: number): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDate(addDays(dateObj, days));
}

/**
 * 날짜 문자열을 Date 객체로 변환
 */
export function toDate(dateString: string): Date {
  return parseISO(dateString);
}
