"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/src/lib/utils/format";
import { formatDate } from "@/src/lib/utils/date";
import { useContract } from "@/src/lib/api/hooks/useContracts";

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

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const contractId = params.id as string;
  const from = searchParams.get("from");
  const [searchConditions, setSearchConditions] = useState<string>("");

  // 계약 상세 조회 - React Query
  const {
    data: contract,
    isLoading: loading,
    error,
  } = useContract(contractId ? Number(contractId) : null);

  useEffect(() => {
    // 검색 조건 저장 (뒤로가기 시 유지)
    const savedConditions = sessionStorage.getItem(
      "contractListSearchConditions",
    );
    if (savedConditions) {
      setSearchConditions(savedConditions);
    }
  }, []);

  useEffect(() => {
    if (error) {
      router.push("/contracts");
    }
  }, [error, router]);

  const handleBack = () => {
    if (from === "contract") {
      // '광고 계약' 화면에서 진입했을 시: '광고 상품 선택' 화면으로 이동
      router.push("/contracts/new/select");
    } else {
      // '광고 현황 조회' 화면에서 진입했을 시: 광고 현황 조회 페이지로 이동(검색 조건 유지)
      if (searchConditions) {
        router.push(`/contracts?${searchConditions}`);
      } else {
        router.push("/contracts");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← 뒤로가기
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">광고 계약 상세</h1>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* 계약 번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계약 번호
          </label>
          <p className="text-lg font-semibold">{contract.contractNumber}</p>
        </div>

        {/* 업체 정보 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            업체
          </label>
          <p className="text-lg">{contract.company.name}</p>
          <p className="text-sm text-gray-500">{contract.company.type}</p>
        </div>

        {/* 상품 정보 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품명
          </label>
          <p className="text-lg">{contract.product.name}</p>
          <p className="text-sm text-gray-600 mt-1">
            {contract.product.description}
          </p>
        </div>

        {/* 계약 기간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계약 기간
          </label>
          <p className="text-lg">
            {formatDate(contract.startDate)} ~ {formatDate(contract.endDate)}
          </p>
        </div>

        {/* 계약 금액 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계약 금액
          </label>
          <p className="text-lg font-semibold">
            {formatCurrency(contract.amount)}
          </p>
        </div>

        {/* 계약 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계약 상태
          </label>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              statusColors[contract.status] || statusColors.PENDING
            }`}
          >
            {statusLabels[contract.status] || contract.statusDescription}
          </span>
        </div>

        {/* 계약 일시 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계약 일시
          </label>
          <p className="text-sm text-gray-600">
            {new Date(contract.createdAt).toLocaleString("ko-KR")}
          </p>
        </div>
      </div>
    </div>
  );
}
