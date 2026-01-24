import { ErrorResponse } from '@/src/types/error';

/**
 * API 에러 처리 유틸리티
 */
export class ApiError extends Error {
  public readonly errorResponse: ErrorResponse;
  
  constructor(errorResponse: ErrorResponse) {
    super(errorResponse.message);
    this.name = 'ApiError';
    this.errorResponse = errorResponse;
  }
  
  /**
   * 필드별 에러 메시지 조회
   */
  getFieldError(fieldName: string): string | undefined {
    return this.errorResponse.details?.[fieldName] as string | undefined;
  }
  
  /**
   * 모든 필드 에러 메시지 조회
   */
  getAllFieldErrors(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (this.errorResponse.details) {
      Object.entries(this.errorResponse.details).forEach(([key, value]) => {
        if (typeof value === 'string') {
          errors[key] = value;
        } else if (Array.isArray(value) && value.length > 0) {
          errors[key] = value[0];
        }
      });
    }
    return errors;
  }
}

/**
 * Response에서 ErrorResponse 추출
 */
export async function extractErrorResponse(response: Response): Promise<ErrorResponse> {
  try {
    const data = await response.json();
    return data as ErrorResponse;
  } catch {
    // JSON 파싱 실패 시 기본 에러 응답 생성
    return {
      code: 'INTERNAL_ERROR',
      message: response.statusText || '알 수 없는 오류가 발생했습니다.',
      timestamp: new Date().toISOString(),
      status: response.status,
    };
  }
}
