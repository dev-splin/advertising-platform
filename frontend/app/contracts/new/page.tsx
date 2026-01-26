"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProduct } from "@/src/lib/api/hooks/useProducts";
import { useCompanies } from "@/src/lib/api/hooks/useCompanies";
import { useCreateContract } from "@/src/lib/api/hooks/useContracts";
import { ApiError } from "@/src/lib/api/error-handler";
import { toastSuccess, toastError } from "@/src/lib/utils/toast";
import { parseNumber } from "@/src/lib/utils/format";
import { getToday, addDaysToDate } from "@/src/lib/utils/date";
import type { Company, ContractRequest } from "@/src/types/api";
import CompanySelect from "./_components/CompanySelect";
import ProductDisplay from "./_components/ProductDisplay";
import ContractPeriod from "./_components/ContractPeriod";
import ContractAmount from "./_components/ContractAmount";
import SubmitButton from "./_components/SubmitButton";

export default function ContractNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdParam = searchParams.get("productId");

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(addDaysToDate(getToday(), 28));
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // productId 검증
  useEffect(() => {
    if (!productIdParam) {
      router.push("/not-found");
      return;
    }

    const productId = Number(productIdParam);
    if (isNaN(productId)) {
      router.push("/not-found");
      return;
    }
  }, [productIdParam, router]);

  // 상품 로드
  const productId = productIdParam ? Number(productIdParam) : null;
  const {
    data: selectedProduct,
    isLoading: productLoading,
    error: productError,
  } = useProduct(productId);

  // 업체 목록 로드
  const { data: companies = [] } = useCompanies();

  // 계약 생성 Mutation
  const createContractMutation = useCreateContract();

  // 상품 로드 에러 처리
  useEffect(() => {
    if (productError) {
      router.push("/not-found");
    }
  }, [productError, router]);

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedCompany) {
      newErrors.company = "업체를 선택해주세요.";
    }

    if (!selectedProduct) {
      newErrors.product = "상품을 선택해주세요.";
    }

    if (!startDate) {
      newErrors.startDate = "계약 시작일을 선택해주세요.";
    }

    if (!endDate) {
      newErrors.endDate = "계약 종료일을 선택해주세요.";
    }

    const amountNum = parseNumber(amount);
    if (!amount || amountNum < 10000 || amountNum > 1000000) {
      newErrors.amount =
        "계약 금액은 10,000원 이상 1,000,000원 이하여야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼이 유효한지 확인 (버튼 활성화 조건)
  const isFormValid = (): boolean => {
    if (!selectedCompany || !selectedProduct || !startDate || !endDate) {
      return false;
    }
    const amountNum = parseNumber(amount);
    if (!amount || amountNum < 10000 || amountNum > 1000000) {
      return false;
    }
    return true;
  };

  // 계약 생성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || createContractMutation.isPending) {
      return;
    }

    if (!selectedCompany || !selectedProduct) {
      return;
    }

    const request: ContractRequest = {
      companyId: selectedCompany.id,
      productId: selectedProduct.id,
      startDate,
      endDate,
      amount: parseNumber(amount),
    };

    try {
      const contract = await createContractMutation.mutateAsync(request);
      toastSuccess(
        `${selectedProduct.name}으로 계약 생성에 성공했습니다.\n${startDate}부터 광고 집행될 예정입니다.`,
      );
      // 계약 상세 페이지로 이동 (진입 경로 정보 전달)
      router.push(`/contracts/${contract.id}?from=contract`);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const errorMessage = error.errorResponse.message;
        const fieldErrors = error.getAllFieldErrors();

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          toastError("입력값을 확인해주세요.");
        } else {
          toastError(errorMessage);
        }
      } else {
        toastError("계약 생성에 실패했습니다.");
      }
    }
  };

  // 로딩 중이거나 상품이 없으면 로딩 표시
  if (productLoading || !selectedProduct) {
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
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8">광고 계약</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        {/* 업체 선택 */}
        <CompanySelect
          companies={companies}
          error={errors.company}
          onSelect={(company) => {
            setSelectedCompany(company);
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.company;
              return newErrors;
            });
          }}
          onErrorChange={(error) => {
            setErrors((prev) => {
              const newErrors = { ...prev };
              if (error) {
                newErrors.company = error;
              } else {
                delete newErrors.company;
              }
              return newErrors;
            });
          }}
        />

        {/* 선택된 상품 표시 */}
        {selectedProduct && <ProductDisplay product={selectedProduct} />}

        {/* 계약 기간 */}
        <ContractPeriod
          startDate={startDate}
          endDate={endDate}
          startDateError={errors.startDate}
          endDateError={errors.endDate}
          onStartDateChange={(date) => setStartDate(date)}
          onEndDateChange={(date) => setEndDate(date)}
        />

        {/* 계약 금액 */}
        <ContractAmount
          error={errors.amount}
          onChange={(value) => setAmount(value)}
          onErrorChange={(error) => {
            setErrors((prev) => {
              const newErrors = { ...prev };
              if (error) {
                newErrors.amount = error;
              } else {
                delete newErrors.amount;
              }
              return newErrors;
            });
          }}
        />

        {/* 제출 버튼 */}
        <SubmitButton
          isPending={createContractMutation.isPending}
          isValid={isFormValid()}
        />
      </form>
    </div>
  );
}
