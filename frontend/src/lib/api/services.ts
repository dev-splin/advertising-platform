import { apiClient } from './client';
import type { Product, Company, Contract, ContractRequest, ContractListRequest, PageResponse } from '@/src/types/api';

/**
 * 상품 API
 */
export const productService = {
  /**
   * 전체 상품 조회
   */
  getAllProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/products');
  },
  
  /**
   * 상품 상세 조회
   */
  getProductById: async (id: number): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },
};

/**
 * 업체 API
 */
export const companyService = {
  /**
   * 전체 업체 조회
   */
  getAllCompanies: async (): Promise<Company[]> => {
    return apiClient.get<Company[]>('/companies');
  },
  
  /**
   * 업체 검색 (자동완성)
   */
  searchCompanies: async (keyword: string): Promise<Company[]> => {
    if (!keyword || keyword.trim() === '') {
      return [];
    }
    return apiClient.get<Company[]>(`/companies/search?keyword=${encodeURIComponent(keyword)}`);
  },
  
  /**
   * 업체 상세 조회
   */
  getCompanyById: async (id: number): Promise<Company> => {
    return apiClient.get<Company>(`/companies/${id}`);
  },
};

/**
 * 계약 API
 */
export const contractService = {
  /**
   * 계약 생성
   */
  createContract: async (request: ContractRequest): Promise<Contract> => {
    return apiClient.post<Contract>('/contracts', request);
  },
  
  /**
   * 계약 상세 조회
   */
  getContractById: async (id: number): Promise<Contract> => {
    return apiClient.get<Contract>(`/contracts/${id}`);
  },
  
  /**
   * 계약 목록 조회
   */
  getContracts: async (request: ContractListRequest = {}): Promise<PageResponse<Contract>> => {
    const params = new URLSearchParams();
    
    if (request.companyName) {
      params.append('companyName', request.companyName);
    }
    if (request.statuses && request.statuses.length > 0) {
      params.append('statuses', request.statuses.join(','));
    }
    if (request.startDate) {
      params.append('startDate', request.startDate);
    }
    if (request.endDate) {
      params.append('endDate', request.endDate);
    }
    if (request.page !== undefined) {
      params.append('page', request.page.toString());
    }
    if (request.size !== undefined) {
      params.append('size', request.size.toString());
    }
    
    const queryString = params.toString();
    return apiClient.get<PageResponse<Contract>>(`/contracts${queryString ? `?${queryString}` : ''}`);
  },
};
