"use client";

import { useState } from "react";
import { formatNumber } from "@/src/lib/utils/format";

interface ContractAmountProps {
  error?: string;
  onChange: (amount: string) => void;
  onErrorChange?: (error: string | undefined) => void;
}

/**
 * 계약 금액 입력 컴포넌트
 */
export default function ContractAmount({
  error,
  onChange,
  onErrorChange,
}: ContractAmountProps) {
  const [amount, setAmount] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const numValue = parseInt(value, 10);

    if (isNaN(numValue) && value !== "") return;

    if (value === "") {
      setAmount("");
      onChange("");
      onErrorChange?.(undefined);
      return;
    }

    if (numValue < 10000) {
      const errorMessage = "계약 금액은 최소 10,000원 이상이어야 합니다.";
      onErrorChange?.(errorMessage);
    } else if (numValue > 1000000) {
      const errorMessage = "계약 금액은 최대 1,000,000원 이하여야 합니다.";
      onErrorChange?.(errorMessage);
    } else {
      onErrorChange?.(undefined);
    }

    const formattedAmount = formatNumber(numValue);
    setAmount(formattedAmount);
    onChange(formattedAmount);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        계약 금액 <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="100,000"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        <span className="absolute right-4 top-2 text-gray-500">원</span>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      <p className="mt-1 text-sm text-gray-500">
        최소 10,000원 ~ 최대 1,000,000원
      </p>
    </div>
  );
}
