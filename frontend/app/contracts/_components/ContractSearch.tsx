"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import AutoComplete from "@/src/components/ui/AutoComplete";
import { addDaysToDate } from "@/src/lib/utils/date";
import type { Company, ContractStatusType } from "@/src/types/api";

interface SearchFormData {
  selectedCompany: { id: number; name: string } | null;
  selectedStatuses: ContractStatusType[];
  startDate: string;
  endDate: string;
}

interface ContractSearchProps {
  companySearchResults: Company[];
  statusOptions: { value: ContractStatusType; label: string }[];
  companySearchKeyword: string;
  defaultValues: SearchFormData;
  onCompanySearchKeywordChange: (keyword: string) => void;
  onSearch: (data: SearchFormData) => void;
}

/**
 * 계약 검색 필터 컴포넌트
 */
export default function ContractSearch({
  companySearchResults,
  statusOptions,
  companySearchKeyword,
  defaultValues,
  onCompanySearchKeywordChange,
  onSearch,
}: ContractSearchProps) {
  console.log("defaultValues", defaultValues);
  const { control, handleSubmit, watch, setValue, reset } =
    useForm<SearchFormData>({
      defaultValues,
      mode: "onChange",
    });

  const startDate = watch("startDate");
  const selectedStatuses = watch("selectedStatuses");
  const allStatusSelected = selectedStatuses.length === statusOptions.length;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

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

  // 전체 상태 선택/해제
  const handleAllStatusToggle = () => {
    if (allStatusSelected) {
      setValue("selectedStatuses", []);
    } else {
      const allStatuses = statusOptions.map((opt) => opt.value);
      setValue("selectedStatuses", allStatuses);
    }
  };

  // 개별 상태 선택/해제
  const handleStatusToggle = (status: ContractStatusType) => {
    const currentStatuses = watch("selectedStatuses");
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s: ContractStatusType) => s !== status)
      : [...currentStatuses, status];
    setValue("selectedStatuses", newStatuses);
  };

  const onSubmit = (data: SearchFormData) => {
    onSearch(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <div className="space-y-4">
        {/* 업체명 검색 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            업체명
          </label>
          <AutoComplete
            items={companySearchResults}
            onSelect={(company) => {
              const companyData = company
                ? { id: company.id, name: company.name }
                : null;
              // selectedCompany 설정
              setValue("selectedCompany", companyData, {
                shouldValidate: true,
              });
              // companySearchKeyword 설정
              onCompanySearchKeywordChange(company ? company.name : "");
            }}
            placeholder="업체명을 입력하세요"
            value={companySearchKeyword || ""}
            onChange={(value) => {
              const selectedCompany = watch("selectedCompany");
              // 입력값이 선택된 회사 이름과 일치하지 않으면 selectedCompany를 null로 설정
              if (
                !value ||
                (selectedCompany && value !== selectedCompany.name)
              ) {
                setValue("selectedCompany", null, {
                  shouldValidate: true,
                });
              }
              onCompanySearchKeywordChange(value);
            }}
          />
        </div>

        {/* 계약 상태 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계약상태
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={allStatusSelected}
                onChange={handleAllStatusToggle}
                className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">전체</span>
            </label>
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(option.value)}
                  onChange={() => handleStatusToggle(option.value)}
                  className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 계약 기간 필터 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계약시작일
            </label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }: { field: any }) => (
                <input
                  type="date"
                  {...field}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계약종료일
            </label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }: { field: any }) => (
                <input
                  type="date"
                  {...field}
                  min={startDate ? addDaysToDate(startDate, 28) : undefined}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
          </div>
        </div>

        {/* 검색 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            검색
          </button>
        </div>
      </div>
    </form>
  );
}
