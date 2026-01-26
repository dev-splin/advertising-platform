import { apiClient } from "../client";
import type { Product } from "@/src/types/api";

/**
 * 상품 API 서비스
 */
export const productService = {
  /**
   * 전체 상품 조회
   * @request GET /api/products
   * @returns {Promise<Product[]>} 상품 목록
   */
  getAllProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>("/products");
  },

  /**
   * 상품 상세 조회
   * @request GET /api/products/{id}
   * @param {number} id - 상품 ID
   * @returns {Promise<Product>} 상품 상세 정보
   */
  getProductById: async (id: number): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },
};
