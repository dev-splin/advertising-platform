import { apiClient } from "../client";
import type { Company } from "@/src/types/api";

/**
 * 업체 API 서비스
 */
export const companyService = {
  /**
   * 전체 업체 조회
   * @request GET /api/companies
   * @returns {Promise<Company[]>} 업체 목록
   */
  getAllCompanies: async (): Promise<Company[]> => {
    return apiClient.get<Company[]>("/companies");
  },

  /**
   * 업체 검색 (자동완성)
   * @request GET /api/companies/search?keyword={keyword}
   * @param {string} keyword - 검색 키워드
   * @returns {Promise<Company[]>} 검색된 업체 목록
   */
  searchCompanies: async (keyword: string): Promise<Company[]> => {
    if (!keyword || keyword.trim() === "") {
      return [];
    }
    return apiClient.get<Company[]>(
      `/companies/search?keyword=${encodeURIComponent(keyword)}`,
    );
  },

  /**
   * 업체 상세 조회
   * @request GET /api/companies/{id}
   * @param {number} id - 업체 ID
   * @returns {Promise<Company>} 업체 상세 정보
   */
  getCompanyById: async (id: number): Promise<Company> => {
    return apiClient.get<Company>(`/companies/${id}`);
  },
};
