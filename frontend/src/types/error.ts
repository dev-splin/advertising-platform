/**
 * Frontend와 Backend 간 통신 시 사용하는 공통 에러 응답 규격
 * 
 * Backend의 ErrorResponse와 동일한 구조를 가집니다.
 */
export interface ErrorResponse {
  /**
   * 에러 코드 (예: "VALIDATION_ERROR", "NOT_FOUND", "INTERNAL_ERROR")
   */
  code: string;
  
  /**
   * 에러 메시지
   */
  message: string;
  
  /**
   * 상세 에러 정보 (필드별 검증 오류 등)
   * 예: { "amount": "계약 금액은 최소 10,000원 이상이어야 합니다." }
   */
  details?: Record<string, string | string[]>;
  
  /**
   * 에러 발생 시각 (ISO 8601 형식)
   */
  timestamp: string;
  
  /**
   * HTTP 상태 코드
   */
  status: number;
}

/**
 * 에러 코드 상수
 */
export enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}
