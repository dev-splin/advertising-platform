'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { productService, companyService, contractService } from '@/src/lib/api/services';
import { ApiError } from '@/src/lib/api/error-handler';
import toast from 'react-hot-toast';
import AutoComplete from '@/src/components/ui/AutoComplete';
import { formatNumber, parseNumber } from '@/src/lib/utils/format';
import { getToday, addDaysToDate } from '@/src/lib/utils/date';
import type { Product, Company, ContractRequest } from '@/src/types/api';

export default function ContractNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdParam = searchParams.get('productId');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companySearchResults, setCompanySearchResults] = useState<Company[]>([]);
  const [companySearchKeyword, setCompanySearchKeyword] = useState('');
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(addDaysToDate(getToday(), 28));
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 상품 목록 로드 및 선택된 상품 설정
  useEffect(() => {
    productService.getAllProducts()
      .then((productList) => {
        setProducts(productList);
        
        // URL 파라미터에서 productId가 있으면 해당 상품 선택
        if (productIdParam) {
          const product = productList.find((p) => p.id === Number(productIdParam));
          if (product) {
            setSelectedProduct(product);
          } else {
            toast.error('선택한 상품을 찾을 수 없습니다.');
            router.push('/contracts/new/select');
          }
        } else if (productList.length > 0) {
          // productId가 없으면 상품 선택 페이지로 리다이렉트
          router.push('/contracts/new/select');
        }
      })
      .catch((error) => {
        toast.error('상품 목록을 불러오는데 실패했습니다.');
        console.error(error);
      });
  }, [productIdParam, router]);

  // 업체 검색 (자동완성)
  useEffect(() => {
    if (companySearchKeyword.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        companyService.searchCompanies(companySearchKeyword)
          .then(setCompanySearchResults)
          .catch(() => {
            setCompanySearchResults([]);
          });
      }, 300); // 디바운싱

      return () => clearTimeout(timeoutId);
    } else {
      setCompanySearchResults([]);
    }
  }, [companySearchKeyword]);

  // 시작일 변경 시 종료일 자동 업데이트
  useEffect(() => {
    if (startDate) {
      const newEndDate = addDaysToDate(startDate, 28);
      setEndDate(newEndDate);
    }
  }, [startDate]);

  // 종료일 최소값 계산
  const getMinEndDate = () => {
    if (!startDate) return getToday();
    return addDaysToDate(startDate, 28);
  };

  // 금액 입력 처리
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue) && value !== '') return;
    
    if (value === '') {
      setAmount('');
      return;
    }
    
    if (numValue < 10000) {
      setErrors((prev) => ({ ...prev, amount: '계약 금액은 최소 10,000원 이상이어야 합니다.' }));
    } else if (numValue > 1000000) {
      setErrors((prev) => ({ ...prev, amount: '계약 금액은 최대 1,000,000원 이하여야 합니다.' }));
    } else {
      setErrors((prev => {
        const newErrors = { ...prev };
        delete newErrors.amount;
        return newErrors;
      }));
    }
    
    setAmount(formatNumber(numValue));
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedCompany) {
      newErrors.company = '업체를 선택해주세요.';
    }
    
    if (!selectedProduct) {
      newErrors.product = '상품을 선택해주세요.';
    }
    
    if (!startDate) {
      newErrors.startDate = '계약 시작일을 선택해주세요.';
    }
    
    if (!endDate) {
      newErrors.endDate = '계약 종료일을 선택해주세요.';
    }
    
    const amountNum = parseNumber(amount);
    if (!amount || amountNum < 10000 || amountNum > 1000000) {
      newErrors.amount = '계약 금액은 10,000원 이상 1,000,000원 이하여야 합니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 계약 생성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const request: ContractRequest = {
        companyId: selectedCompany!.id,
        productId: selectedProduct!.id,
        startDate,
        endDate,
        amount: parseNumber(amount),
      };
      
      const contract = await contractService.createContract(request);
      
      toast.success(
        `${selectedCompany!.name}으로 계약 생성에 성공했습니다.\n${startDate}부터 광고 집행될 예정입니다.`,
        { duration: 5000 }
      );
      
      // 계약 상세 페이지로 이동
      router.push(`/contracts/${contract.id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessage = error.errorResponse.message;
        const fieldErrors = error.getAllFieldErrors();
        
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          toast.error('입력값을 확인해주세요.');
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error('계약 생성에 실패했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 상품이 선택되지 않았으면 로딩 표시
  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">광고 계약</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* 업체 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            업체 <span className="text-red-500">*</span>
          </label>
          <AutoComplete
            items={companySearchResults}
            onSelect={setSelectedCompany}
            placeholder="업체명을 입력하세요"
            value={companySearchKeyword}
            onChange={setCompanySearchKeyword}
            className={errors.company ? 'border-red-500' : ''}
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-500">{errors.company}</p>
          )}
        </div>

        {/* 선택된 상품 표시 */}
        {selectedProduct && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              선택된 상품
            </label>
            <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
              <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/contracts/new/select')}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              다른 상품 선택하기
            </button>
          </div>
        )}

        {/* 계약 기간 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계약 시작일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={getToday()}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계약 종료일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={getMinEndDate()}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* 계약 금액 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계약 금액 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="100,000"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <span className="absolute right-4 top-2 text-gray-500">원</span>
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            최소 10,000원 ~ 최대 1,000,000원
          </p>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? '처리 중...' : '계약'}
          </button>
        </div>
      </form>
    </div>
  );
}
