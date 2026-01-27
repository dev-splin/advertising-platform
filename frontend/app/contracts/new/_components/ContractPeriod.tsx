"use client";

import { getToday, addDaysToDate } from "@/src/lib/utils/date";

interface ContractPeriodProps {
  startDate: string;
  endDate: string;
  startDateError?: string;
  endDateError?: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

/**
 * 계약 기간 선택 컴포넌트
 */
export default function ContractPeriod({
  startDate,
  endDate,
  startDateError,
  endDateError,
  onStartDateChange,
  onEndDateChange,
}: ContractPeriodProps) {
  const getMinEndDate = () => {
    if (!startDate) return getToday();
    return addDaysToDate(startDate, 28);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
          계약 시작일 <span className="text-red-500">*</span>
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          min={getToday()}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            startDateError ? "border-red-500" : "border-gray-300"
          }`}
        />
        {startDateError && (
          <p className="mt-1 text-sm text-red-500">{startDateError}</p>
        )}
      </div>

      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
          계약 종료일 <span className="text-red-500">*</span>
        </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          min={getMinEndDate()}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            endDateError ? "border-red-500" : "border-gray-300"
          }`}
        />
        {endDateError && (
          <p className="mt-1 text-sm text-red-500">{endDateError}</p>
        )}
      </div>
    </div>
  );
}
