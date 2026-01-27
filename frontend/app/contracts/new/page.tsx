"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProduct } from "@/src/lib/api/hooks/useProducts";
import { useCompanies } from "@/src/lib/api/hooks/useCompanies";
import { useCreateContract } from "@/src/lib/api/hooks/useContracts";
import { ApiError } from "@/src/lib/api/error-handler";
import { toastSuccess, toastError } from "@/src/lib/utils/toast";
import { parseNumber } from "@/src/lib/utils/format";
import { getToday, addDaysToDate } from "@/src/lib/utils/date";
import type { ContractRequest } from "@/src/types/api";
import {
  contractFormSchema,
  type ContractFormData,
} from "@/app/contracts/new/_schemas/contractFormSchema";
import AutoComplete from "@/src/components/ui/AutoComplete";
import ProductDisplay from "@/app/contracts/new/_components/ProductDisplay";
import ContractPeriod from "@/app/contracts/new/_components/ContractPeriod";
import ContractAmount from "@/app/contracts/new/_components/ContractAmount";
import SubmitButton from "@/app/contracts/new/_components/SubmitButton";

export default function ContractNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdParam = searchParams.get("productId");

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

  // React Hook Form 설정
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      companyId: 0,
      startDate: getToday(),
      endDate: addDaysToDate(getToday(), 28),
      amount: "",
    },
    mode: "onChange",
  });

  const startDate = watch("startDate");
  const selectedCompanyId = watch("companyId");

  // companySearchKeyword는 별도 상태로 관리 (검색용)
  const [companySearchKeyword, setCompanySearchKeyword] = useState("");

  // selectedCompanyId가 변경되면 companySearchKeyword 업데이트
  useEffect(() => {
    if (selectedCompanyId && selectedCompanyId > 0) {
      const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
      if (selectedCompany) {
        setCompanySearchKeyword(selectedCompany.name);
      }
    } else {
      setCompanySearchKeyword("");
    }
  }, [selectedCompanyId, companies]);

  // productId 검증
  useEffect(() => {
    const productId = Number(productIdParam);
    if (isNaN(productId)) {
      router.push("/not-found");
    }
  }, [productIdParam, router]);

  // 상품 로드 에러 처리
  useEffect(() => {
    if (productError) {
      router.push("/not-found");
    }
  }, [productError, router]);

  // 시작일 변경 시 종료일 자동 업데이트
  useEffect(() => {
    if (startDate) {
      const minEndDate = addDaysToDate(startDate, 28);
      const currentEndDate = watch("endDate");
      if (!currentEndDate || currentEndDate < minEndDate) {
        setValue("endDate", minEndDate, { shouldDirty: false });
      }
    }
  }, [startDate, setValue, watch]);

  // 계약 생성
  const onSubmit = async (data: ContractFormData) => {
    if (!selectedProduct || createContractMutation.isPending) {
      return;
    }

    const request: ContractRequest = {
      companyId: data.companyId,
      productId: selectedProduct.id,
      startDate: data.startDate,
      endDate: data.endDate,
      amount: parseNumber(data.amount),
    };

    try {
      const contract = await createContractMutation.mutateAsync(request);
      toastSuccess(
        `${selectedProduct.name}으로 계약 생성에 성공했습니다.\n${data.startDate}부터 광고 집행될 예정입니다.`,
      );
      // 계약 상세 페이지로 이동 (진입 경로 정보 전달)
      router.push(`/contracts/${contract.id}?from=contract`);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const errorMessage = error.errorResponse.message;
        const fieldErrors = error.getAllFieldErrors();

        if (Object.keys(fieldErrors).length > 0) {
          // 서버에서 반환한 필드 에러를 폼에 설정
          Object.entries(fieldErrors).forEach(([field, message]) => {
            setError(field as keyof ContractFormData, {
              type: "server",
              message: Array.isArray(message) ? message[0] : message,
            });
          });
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
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        {/* 업체 선택 */}
        <Controller
          name="companyId"
          control={control}
          render={({ field, fieldState }) => {
            const selectedCompany = companies.find((c) => c.id === field.value);

            return (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  업체 <span className="text-red-500">*</span>
                </label>
                <AutoComplete
                  items={companies}
                  onSelect={(company) => {
                    field.onChange(company ? company.id : 0);
                    setCompanySearchKeyword(company ? company.name : "");
                  }}
                  placeholder="업체를 선택하세요"
                  value={companySearchKeyword}
                  onChange={(value) => {
                    setCompanySearchKeyword(value);
                    const matchingCompany = companies.find(
                      (c) => c.name === value,
                    );
                    if (!matchingCompany || value !== matchingCompany.name) {
                      field.onChange(0);
                    }
                  }}
                  className={fieldState.error ? "border-red-500" : ""}
                />
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            );
          }}
        />

        {/* 선택된 상품 표시 */}
        {selectedProduct && <ProductDisplay product={selectedProduct} />}

        {/* 계약 기간 */}
        <Controller
          name="startDate"
          control={control}
          render={({ field, fieldState }) => (
            <Controller
              name="endDate"
              control={control}
              render={({
                field: endDateField,
                fieldState: endDateFieldState,
              }) => (
                <ContractPeriod
                  startDate={field.value}
                  endDate={endDateField.value}
                  startDateError={fieldState.error?.message}
                  endDateError={endDateFieldState.error?.message}
                  onStartDateChange={field.onChange}
                  onEndDateChange={endDateField.onChange}
                />
              )}
            />
          )}
        />

        {/* 계약 금액 */}
        <Controller
          name="amount"
          control={control}
          render={({ field, fieldState }) => (
            <ContractAmount
              error={fieldState.error?.message}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* 제출 버튼 */}
        <SubmitButton
          isDisabled={
            !isValid ||
            selectedProduct === null ||
            isSubmitSuccessful ||
            isSubmitting
          }
        />
      </form>
    </div>
  );
}
