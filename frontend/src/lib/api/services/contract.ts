import { apiClient } from "../client";
import type {
  Contract,
  ContractRequest,
  ContractListRequest,
  PageResponse,
} from "@/src/types/api";

/**
 * 계약 API 서비스
 */
export const contractService = {
  /**
   * 계약 생성
   * @request POST /api/contracts
   * @param {ContractRequest} request - 계약 생성 요청 데이터
   * @returns {Promise<Contract>} 생성된 계약 정보
   */
  createContract: async (request: ContractRequest): Promise<Contract> => {
    return apiClient.post<Contract>("/contracts", request);
  },

  /**
   * 계약 상세 조회
   * @request GET /api/contracts/{id}
   * @param {number} id - 계약 ID
   * @returns {Promise<Contract>} 계약 상세 정보
   */
  getContractById: async (id: number): Promise<Contract> => {
    return apiClient.get<Contract>(`/contracts/${id}`);
  },

  /**
   * 계약 목록 조회 (페이징)
   * @request GET /api/contracts?companyName={name}&statuses={statuses}&startDate={date}&endDate={date}&page={page}&size={size}
   * @param {ContractListRequest} request - 계약 목록 조회 요청 데이터
   * @returns {Promise<PageResponse<Contract>>} 계약 목록 (페이징 정보 포함)
   */
  getContracts: async (
    request: ContractListRequest = {},
  ): Promise<PageResponse<Contract>> => {
    const params = new URLSearchParams();

    if (request.companyName) {
      params.append("companyName", request.companyName);
    }
    if (request.statuses && request.statuses.length > 0) {
      params.append("statuses", request.statuses.join(","));
    }
    if (request.startDate) {
      params.append("startDate", request.startDate);
    }
    if (request.endDate) {
      params.append("endDate", request.endDate);
    }
    if (request.page !== undefined) {
      params.append("page", request.page.toString());
    }
    if (request.size !== undefined) {
      params.append("size", request.size.toString());
    }

    const queryString = params.toString();
    return apiClient.get<PageResponse<Contract>>(
      `/contracts${queryString ? `?${queryString}` : ""}`,
    );
  },
};
