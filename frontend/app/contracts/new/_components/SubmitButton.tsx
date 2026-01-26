"use client";

interface SubmitButtonProps {
  isPending: boolean;
  isValid: boolean;
}

/**
 * 계약 제출 버튼 컴포넌트
 */
export default function SubmitButton({ isPending, isValid }: SubmitButtonProps) {
  return (
    <div className="flex justify-end pt-4">
      <button
        type="submit"
        disabled={isPending || !isValid}
        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
          isPending || !isValid
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isPending ? "처리 중..." : "계약"}
      </button>
    </div>
  );
}
