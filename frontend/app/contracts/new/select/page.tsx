'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/src/lib/api/services';
import toast from 'react-hot-toast';
import type { Product } from '@/src/types/api';

export default function ProductSelectPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAllProducts()
      .then(setProducts)
      .catch((error) => {
        toast.error('상품 목록을 불러오는데 실패했습니다.');
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleProductSelect = (product: Product) => {
    router.push(`/contracts/new?productId=${product.id}`);
  };

  if (products.length === 0 && !loading) {
    return (
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-8">광고 상품 선택</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">등록된 상품이 없습니다.</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8">광고 상품 선택</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductSelect(product)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 border-gray-200 hover:border-blue-500"
          >
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <div className="mt-4 text-blue-600 font-semibold">
              선택하기 →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
