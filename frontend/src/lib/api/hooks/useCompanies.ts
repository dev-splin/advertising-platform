import { useQuery } from "@tanstack/react-query";
import { queries } from "@/src/lib/api/queryKeyFactories";

/**
 * 전체 업체 조회 Hook
 * @request GET /api/companies
 * @returns {UseQueryResult<Company[], Error>} 업체 목록 조회 결과
 */
export const useCompanies = () => {
  return useQuery({
    ...queries.companies.lists,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 업체 검색 Hook (자동완성)
 * @request GET /api/companies/search?keyword={keyword}
 * @param {string} keyword - 검색 키워드
 * @returns {UseQueryResult<Company[], Error>} 검색된 업체 목록 조회 결과
 */
export const useSearchCompanies = (keyword: string) => {
  return useQuery({
    ...queries.companies.search(keyword),
    enabled: keyword.trim().length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
