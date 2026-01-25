'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { contractService } from '@/src/lib/api/services';
import { ApiError } from '@/src/lib/api/error-handler';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/src/lib/utils/format';
import { formatDate } from '@/src/lib/utils/date';
import type { Contract } from '@/src/types/api';

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

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params.id as string;
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contractId) return;

    contractService.getContractById(Number(contractId))
      .then(setContract)
      .catch((error) => {
        if (error instanceof ApiError) {
          toast.error(error.errorResponse.message);
        } else {
          toast.error('계약 정보를 불러오는데 실패했습니다.');
        }
        router.push('/contracts');
      })
      .finally(() => setLoading(false));
  }, [contractId, router]);

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
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
          <p className="text-sm text-gray-600 mt-1">{contract.product.description}</p>
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
          <p className="text-lg font-semibold">{formatCurrency(contract.amount)}</p>
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
            {new Date(contract.createdAt).toLocaleString('ko-KR')}
          </p>
        </div>
      </div>
    </div>
  );
}
