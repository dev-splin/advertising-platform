"use client";

import { useRouter } from "next/navigation";
import { formatCurrency } from "@/src/lib/utils/format";
import { formatDate } from "@/src/lib/utils/date";
import type { Contract } from "@/src/types/api";

interface ContractListProps {
  contracts: Contract[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
  onPageChange: (page: number) => void;
}

/**
 * 계약 목록 컴포넌트
 */
export default function ContractList({
  contracts,
  loading,
  page,
  totalPages,
  totalElements,
  statusLabels,
  statusColors,
  onPageChange,
}: ContractListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        조회된 계약이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                계약번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                업체
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                계약 기간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                계약 금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                계약 상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contracts.map((contract) => (
              <tr
                key={contract.id}
                onClick={() => router.push(`/contracts/${contract.id}`)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
                  {contract.contractNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contract.company.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {contract.product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(contract.startDate)} ~ {formatDate(contract.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(contract.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      statusColors[contract.status] || statusColors.PENDING
                    }`}
                  >
                    {statusLabels[contract.status] || contract.statusDescription}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            총 {totalElements}건 중 {page * 5 + 1}~{Math.min((page + 1) * 5, totalElements)}건
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              className={`px-4 py-2 rounded-lg ${
                page === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              이전
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-2 rounded-lg ${
                    page === pageNum
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {pageNum + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className={`px-4 py-2 rounded-lg ${
                page >= totalPages - 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
