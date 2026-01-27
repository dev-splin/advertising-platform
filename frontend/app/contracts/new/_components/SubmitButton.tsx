"use client";

interface SubmitButtonProps {
  isDisabled: boolean;
}

/**
 * 계약 제출 버튼 컴포넌트
 */
export default function SubmitButton({ isDisabled }: SubmitButtonProps) {
  return (
    <div className="flex justify-end pt-4">
      <button
        type="submit"
        disabled={isDisabled}
        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        계약
      </button>
    </div>
  );
}
