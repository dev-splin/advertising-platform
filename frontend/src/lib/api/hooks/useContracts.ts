import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractService } from '@/src/lib/api/services/contract';
import { queries } from '@/src/lib/api/queryKeyFactories';
import type { ContractListRequest, ContractRequest } from '@/src/types/api';

/**
 * 계약 목록 조회 Hook (페이징)
 * @request GET /api/contracts?companyName={name}&statuses={statuses}&startDate={date}&endDate={date}&page={page}&size={size}
 * @param {ContractListRequest} request - 계약 목록 조회 필터 조건
 * @returns {UseQueryResult<PageResponse<Contract>, Error>} 계약 목록 조회 결과
 */
export const useContracts = (request: ContractListRequest = {}) => {
  return useQuery({
    ...queries.contracts.list(request),
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * 계약 상세 조회 Hook
 * @request GET /api/contracts/{id}
 * @param {number | null} id - 계약 ID
 * @returns {UseQueryResult<Contract, Error>} 계약 상세 조회 결과
 */
export const useContract = (id: number | null) => {
  return useQuery({
    ...queries.contracts.detail(id!),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * 계약 생성 Mutation Hook
 * @request POST /api/contracts
 * @returns {UseMutationResult<Contract, Error, ContractRequest>} 계약 생성 mutation 결과
 */
export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ContractRequest) => contractService.createContract(request),
    onSuccess: () => {
      // 계약 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: queries.contracts.list._def });
    },
  });
};
