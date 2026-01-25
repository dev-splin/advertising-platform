'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { contractService, companyService } from '@/src/lib/api/services';
import { ApiError } from '@/src/lib/api/error-handler';
import toast from 'react-hot-toast';
import AutoComplete from '@/src/components/ui/AutoComplete';
import { formatCurrency } from '@/src/lib/utils/format';
import { formatDate, getToday, addDaysToDate } from '@/src/lib/utils/date';
import type { Contract, ContractStatusType, Company } from '@/src/types/api';

const statusOptions: { value: ContractStatusType; label: string }[] = [
  { value: 'PENDING', label: '집행전' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'CANCELLED', label: '광고취소' },
  { value: 'COMPLETED', label: '광고종료' },
];

const statusLabels: Record<string, string> = {
  PENDING: '집행전',
  IN_PROGRESS: '진행중',
  CANCELLED: '광고취소',
  COMPLETED: '광고종료',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
};

export default function ContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // 필터 상태
  const [companySearchKeyword, setCompanySearchKeyword] = useState('');
  const [companySearchResults, setCompanySearchResults] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<ContractStatusType[]>([]);
  const [allStatusSelected, setAllStatusSelected] = useState(false);
  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(addDaysToDate(getToday(), 28));

  // 업체 검색 (자동완성)
  useEffect(() => {
    if (companySearchKeyword.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        companyService.searchCompanies(companySearchKeyword)
          .then(setCompanySearchResults)
          .catch(() => {
            setCompanySearchResults([]);
          });
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setCompanySearchResults([]);
    }
  }, [companySearchKeyword]);

  // 계약 목록 조회
  const fetchContracts = async (pageNum: number = 0) => {
    setLoading(true);
    try {
      const response = await contractService.getContracts({
        companyName: selectedCompany?.name,
        statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
        startDate,
        endDate,
        page: pageNum,
        size: 5,
      });

      setContracts(response.content);
      setPage(response.page);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.errorResponse.message);
      } else {
        toast.error('계약 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 필터 변경 시 첫 페이지로 리셋하고 조회
  useEffect(() => {
    setPage(0);
    fetchContracts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompany, selectedStatuses, startDate, endDate]);

  // 페이지 변경 시 조회
  useEffect(() => {
    fetchContracts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // 전체 상태 선택/해제
  const handleAllStatusToggle = () => {
    if (allStatusSelected) {
      setSelectedStatuses([]);
      setAllStatusSelected(false);
    } else {
      const allStatuses = statusOptions.map((opt) => opt.value);
      setSelectedStatuses(allStatuses);
      setAllStatusSelected(true);
    }
  };

  // 개별 상태 선택/해제
  const handleStatusToggle = (status: ContractStatusType) => {
    setSelectedStatuses((prev) => {
      const newStatuses = prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status];
      
      // 모든 상태가 선택되었는지 확인
      setAllStatusSelected(newStatuses.length === statusOptions.length);
      
      return newStatuses;
    });
  };

  // 상태 선택 변경 시 전체 체크박스 동기화
  useEffect(() => {
    setAllStatusSelected(selectedStatuses.length === statusOptions.length);
  }, [selectedStatuses]);

  // 검색 버튼 클릭 (필터 변경 시 자동으로 조회되므로 실제로는 필요 없지만 유지)
  const handleSearch = () => {
    setPage(0);
    fetchContracts(0);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">광고 현황 조회</h1>

      {/* 필터 영역 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-4">
          {/* 업체명 검색 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              업체명
            </label>
            <AutoComplete
              items={companySearchResults}
              onSelect={setSelectedCompany}
              placeholder="업체명을 입력하세요"
              value={companySearchKeyword}
              onChange={setCompanySearchKeyword}
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
                <label key={option.value} className="flex items-center cursor-pointer">
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
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                계약종료일
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 검색 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              검색
            </button>
          </div>
        </div>
      </div>

      {/* 계약 목록 */}
      <div className="bg-white rounded-lg shadow-md">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            조회된 계약이 없습니다.
          </div>
        ) : (
          <>
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
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className={`px-4 py-2 rounded-lg ${
                      page === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    이전
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className={`px-4 py-2 rounded-lg ${
                      page >= totalPages - 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
