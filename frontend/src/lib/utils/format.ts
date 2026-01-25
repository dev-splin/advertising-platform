/**
 * 숫자 포맷팅 유틸리티
 */

/**
 * 숫자를 천 단위 콤마가 포함된 문자열로 변환
 */
export function formatNumber(num: number | string): string {
  const numStr = typeof num === 'string' ? num.replace(/,/g, '') : num.toString();
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 콤마가 포함된 문자열을 숫자로 변환
 */
export function parseNumber(str: string): number {
  return parseInt(str.replace(/,/g, ''), 10) || 0;
}

/**
 * 금액을 포맷팅 (예: 100000 -> "100,000원")
 */
export function formatCurrency(amount: number | string): string {
  return `${formatNumber(amount)}원`;
}
