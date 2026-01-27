import { ApiError, extractErrorResponse } from '@/src/lib/api/error-handler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api';

/**
 * API 클라이언트 기본 설정
 */
export class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }
  
  /**
   * GET 요청
   */
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorResponse = await extractErrorResponse(response);
      throw new ApiError(errorResponse);
    }
    
    return response.json();
  }
  
  /**
   * POST 요청
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      const errorResponse = await extractErrorResponse(response);
      throw new ApiError(errorResponse);
    }
    
    return response.json();
  }
}

export const apiClient = new ApiClient();
