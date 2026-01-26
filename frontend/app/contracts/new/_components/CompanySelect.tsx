"use client";

import { useState, useRef, useEffect } from "react";
import AutoComplete from "@/src/components/ui/AutoComplete";
import type { Company } from "@/src/types/api";

interface CompanySelectProps {
  companies: Company[];
  error?: string;
  onSelect: (company: Company | null) => void;
  onErrorChange?: (error: string | undefined) => void;
}

/**
 * 업체 선택 컴포넌트
 */
export default function CompanySelect({
  companies,
  error,
  onSelect,
  onErrorChange,
}: CompanySelectProps) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companySearchKeyword, setCompanySearchKeyword] = useState("");
  const selectedCompanyRef = useRef<Company | null>(null);

  // selectedCompany가 변경될 때 ref도 업데이트
  useEffect(() => {
    selectedCompanyRef.current = selectedCompany;
  }, [selectedCompany]);

  const handleSelect = (company: Company) => {
    setSelectedCompany(company);
    selectedCompanyRef.current = company;
    setCompanySearchKeyword(company.name);
    onErrorChange?.(undefined);
    onSelect(company);
  };

  const handleSearchKeywordChange = (value: string) => {
    setCompanySearchKeyword(value);
    // ref를 사용하여 최신 selectedCompany 값 확인
    const currentSelectedCompany = selectedCompanyRef.current;
    
    // 선택된 회사가 있고, 입력값이 선택된 회사 이름과 일치하지 않을 때만 null로 설정
    if (currentSelectedCompany && value !== currentSelectedCompany.name) {
      setSelectedCompany(null);
      selectedCompanyRef.current = null;
      onSelect(null);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        업체 <span className="text-red-500">*</span>
      </label>
      <AutoComplete
        items={companies}
        onSelect={handleSelect}
        placeholder="업체를 선택하세요"
        value={companySearchKeyword}
        onChange={handleSearchKeywordChange}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
