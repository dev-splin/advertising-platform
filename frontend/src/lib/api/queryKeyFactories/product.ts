import { createQueryKeys } from "@lukemorales/query-key-factory";
import { productService } from "../services/product";

/**
 * 상품 Query Key Factory
 * @description 상품 관련 query key와 queryFn을 정의합니다.
 */
export default createQueryKeys("products", {
  /**
   * 전체 상품 목록 조회
   * @request GET /api/products
   */
  lists: {
    queryKey: null,
    queryFn: () => productService.getAllProducts(),
  },
  /**
   * 상품 상세 조회
   * @request GET /api/products/{id}
   * @param {number} id - 상품 ID
   */
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () => productService.getProductById(id),
  }),
});
