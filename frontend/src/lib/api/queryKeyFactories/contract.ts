import { createQueryKeys } from "@lukemorales/query-key-factory";
import { contractService } from "../services/contract";
import type { ContractListRequest } from "@/src/types/api";

/**
 * 계약 Query Key Factory
 * @description 계약 관련 query key와 queryFn을 정의합니다.
 */
export default createQueryKeys("contracts", {
  /**
   * 계약 목록 조회 (페이징)
   * @request GET /api/contracts?companyName={name}&statuses={statuses}&startDate={date}&endDate={date}&page={page}&size={size}
   * @param {ContractListRequest} filters - 계약 목록 조회 필터 조건
   */
  list: (filters: ContractListRequest) => ({
    queryKey: [filters],
    queryFn: () => contractService.getContracts(filters),
  }),
  /**
   * 계약 상세 조회
   * @request GET /api/contracts/{id}
   * @param {number} id - 계약 ID
   */
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () => contractService.getContractById(id),
  }),
});
