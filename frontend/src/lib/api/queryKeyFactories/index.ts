import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import product from "./product";
import company from "./company";
import contract from "./contract";

/**
 * 통합 Query Keys
 * @description 모든 도메인의 query key를 병합한 단일 객체입니다.
 * @example
 * ```typescript
 * import { queries } from '@/src/lib/api/queryKeyFactories';
 * 
 * // 사용 예시
 * queries.products.lists
 * queries.companies.search(keyword)
 * queries.contracts.detail(id)
 * ```
 */
export const queries = mergeQueryKeys(product, company, contract);
