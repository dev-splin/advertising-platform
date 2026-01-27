import { useQuery } from '@tanstack/react-query';
import { queries } from '@/src/lib/api/queryKeyFactories';

/**
 * 전체 상품 조회 Hook
 * @request GET /api/products
 * @returns {UseQueryResult<Product[], Error>} 상품 목록 조회 결과
 */
export const useProducts = () => {
  return useQuery({
    ...queries.products.lists,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * 상품 상세 조회 Hook
 * @request GET /api/products/{id}
 * @param {number | null} id - 상품 ID
 * @returns {UseQueryResult<Product, Error>} 상품 상세 조회 결과
 */
export const useProduct = (id: number | null) => {
  return useQuery({
    ...queries.products.detail(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
