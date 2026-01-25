/**
 * API 응답 타입 정의
 */

export interface Product {
  id: number;
  name: string;
  description: string;
}

export interface Company {
  id: number;
  companyNumber: string;
  name: string;
  type: string;
}

export interface ContractStatus {
  PENDING: '집행전';
  IN_PROGRESS: '진행중';
  CANCELLED: '광고취소';
  COMPLETED: '광고종료';
}

export type ContractStatusType = 'PENDING' | 'IN_PROGRESS' | 'CANCELLED' | 'COMPLETED';

export interface Contract {
  id: number;
  contractNumber: string;
  company: Company;
  product: Product;
  startDate: string;
  endDate: string;
  amount: number;
  status: ContractStatusType;
  statusDescription: string;
  createdAt: string;
}

export interface ContractRequest {
  companyId: number;
  productId: number;
  startDate: string;
  endDate: string;
  amount: number;
}

export interface ContractListRequest {
  companyName?: string;
  statuses?: ContractStatusType[];
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
