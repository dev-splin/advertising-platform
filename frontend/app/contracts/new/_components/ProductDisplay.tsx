"use client";

import { useRouter } from "next/navigation";
import type { Product } from "@/src/types/api";

interface ProductDisplayProps {
  product: Product;
}

/**
 * 선택된 상품 표시 컴포넌트
 */
export default function ProductDisplay({ product }: ProductDisplayProps) {
  const router = useRouter();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        선택된 상품
      </label>
      <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
      </div>
      <button
        type="button"
        onClick={() => router.push("/contracts/new/select")}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
      >
        다른 상품 선택하기
      </button>
    </div>
  );
}
