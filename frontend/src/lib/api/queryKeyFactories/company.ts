import { createQueryKeys } from "@lukemorales/query-key-factory";
import { companyService } from "@/src/lib/api/services/company";

/**
 * 업체 Query Key Factory
 * @description 업체 관련 query key와 queryFn을 정의합니다.
 */
export default createQueryKeys("companies", {
  /**
   * 전체 업체 목록 조회
   * @request GET /api/companies
   */
  lists: {
    queryKey: null,
    queryFn: () => companyService.getAllCompanies(),
  },
  /**
   * 업체 검색 (자동완성)
   * @request GET /api/companies/search?keyword={keyword}
   * @param {string} keyword - 검색 키워드
   */
  search: (keyword: string) => ({
    queryKey: [keyword],
    queryFn: () => companyService.searchCompanies(keyword),
  }),
  /**
   * 업체 상세 조회
   * @request GET /api/companies/{id}
   * @param {number} id - 업체 ID
   */
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () => companyService.getCompanyById(id),
  }),
});
