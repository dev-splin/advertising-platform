"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useContracts } from "@/src/lib/api/hooks/useContracts";
import { useSearchCompanies } from "@/src/lib/api/hooks/useCompanies";
import { toastError } from "@/src/lib/utils/toast";
import { getToday, addDaysToDate } from "@/src/lib/utils/date";
import type { ContractStatusType } from "@/src/types/api";
import ContractSearch from "@/app/contracts/_components/ContractSearch";
import ContractList from "@/app/contracts/_components/ContractList";

interface SearchFormData {
  selectedCompany: { id: number; name: string } | null;
  selectedStatuses: ContractStatusType[];
  startDate: string;
  endDate: string;
}

const statusOptions: { value: ContractStatusType; label: string }[] = [
  { value: "PENDING", label: "집행전" },
  { value: "IN_PROGRESS", label: "진행중" },
  { value: "CANCELLED", label: "광고취소" },
  { value: "COMPLETED", label: "광고종료" },
];

const statusLabels: Record<string, string> = {
  PENDING: "집행전",
  IN_PROGRESS: "진행중",
  CANCELLED: "광고취소",
  COMPLETED: "광고종료",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-gray-100 text-gray-800",
};

export default function ContractsPage() {
  const [page, setPage] = useState(0);

  // companySearchKeyword는 별도 상태로 관리
  const [companySearchKeyword, setCompanySearchKeyword] = useState("");

  // 검색 폼 상태
  const [searchFormData, setSearchFormData] = useState<SearchFormData>({
    selectedCompany: null,
    selectedStatuses: [],
    startDate: getToday(),
    endDate: addDaysToDate(getToday(), 28),
  });

  // 초기 마운트 시 cookie에서 검색 조건 복원
  useEffect(() => {
    const savedConditions = Cookies.get("contractListSearchConditions");
    if (savedConditions) {
      const params = new URLSearchParams(savedConditions);
      const companyName = params.get("companyName");
      const savedCompanySearchKeyword = params.get("companySearchKeyword");
      const statuses = params.get("statuses");
      const startDate = params.get("startDate");
      const endDate = params.get("endDate");

      if (savedCompanySearchKeyword) {
        setCompanySearchKeyword(savedCompanySearchKeyword);
      }

      setSearchFormData({
        selectedCompany: companyName
          ? { id: 0, name: companyName } // id는 나중에 검색 결과에서 찾아야 함
          : null,
        selectedStatuses: statuses
          ? (statuses.split(",") as ContractStatusType[])
          : [],
        startDate: startDate || getToday(),
        endDate: endDate || addDaysToDate(getToday(), 28),
      });
    }
  }, []);

  // 업체 검색 (자동완성)
  const { data: companySearchResults = [] } =
    useSearchCompanies(companySearchKeyword);

  // 계약 목록 조회
  const {
    data: contractsData,
    isLoading: loading,
    error,
  } = useContracts({
    companyName: searchFormData.selectedCompany?.name,
    statuses:
      searchFormData.selectedStatuses.length > 0
        ? searchFormData.selectedStatuses
        : undefined,
    startDate: searchFormData.startDate,
    endDate: searchFormData.endDate,
    page,
    size: 5,
  });

  const contracts = contractsData?.content || [];
  const totalPages = contractsData?.totalPages || 0;
  const totalElements = contractsData?.totalElements || 0;

  // 에러 처리
  useEffect(() => {
    if (error) {
      toastError("계약 목록을 불러오는데 실패했습니다.");
    }
  }, [error]);

  // 검색 조건을 cookie에 저장하는 함수 (상세 페이지에서 뒤로가기 시 사용)
  const saveSearchConditionsToCookie = (
    formData: SearchFormData,
    searchKeyword: string,
  ) => {
    const params = new URLSearchParams();
    if (formData.selectedCompany?.name) {
      params.append("companyName", formData.selectedCompany.name);
    }
    if (searchKeyword) {
      params.append("companySearchKeyword", searchKeyword);
    }
    if (formData.selectedStatuses.length > 0) {
      params.append("statuses", formData.selectedStatuses.join(","));
    }
    if (formData.startDate) {
      params.append("startDate", formData.startDate);
    }
    if (formData.endDate) {
      params.append("endDate", formData.endDate);
    }
    Cookies.set("contractListSearchConditions", params.toString(), {
      expires: 7, // 7일 후 만료
    });
  };

  // 검색 폼 데이터 변경 시 첫 페이지로 리셋
  useEffect(() => {
    setPage(0);
  }, [
    searchFormData.selectedCompany,
    searchFormData.selectedStatuses,
    searchFormData.startDate,
    searchFormData.endDate,
  ]);

  // 검색 실행
  const handleSearch = (data: SearchFormData) => {
    setSearchFormData(data);
    setPage(0);
    // 검색 실행 시 cookie에 저장
    saveSearchConditionsToCookie(data, companySearchKeyword);
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8">광고 현황 조회</h1>

      {/* 필터 영역 */}
      <ContractSearch
        companySearchResults={companySearchResults}
        statusOptions={statusOptions}
        companySearchKeyword={companySearchKeyword}
        defaultValues={searchFormData}
        onCompanySearchKeywordChange={setCompanySearchKeyword}
        onSearch={handleSearch}
      />

      {/* 계약 목록 */}
      <ContractList
        contracts={contracts}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        statusLabels={statusLabels}
        statusColors={statusColors}
        onPageChange={setPage}
      />
    </div>
  );
}
