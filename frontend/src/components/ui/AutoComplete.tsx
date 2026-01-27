"use client";

import { useState, useEffect, useRef } from "react";
import type { Company } from "@/src/types/api";

interface AutoCompleteProps {
  items: Company[];
  onSelect: (item: Company) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function AutoComplete({
  items,
  onSelect,
  placeholder = "검색...",
  className = "",
  value = "",
  onChange,
}: AutoCompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowDropdown(true);
    setHighlightedIndex(-1);

    // 이전 타이머가 있으면 취소
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 디바운스 적용 (500ms)
    debounceTimerRef.current = setTimeout(() => {
      onChange?.(newValue);
    }, 500);
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleSelect = (item: Company) => {
    setInputValue(item.name);
    setShowDropdown(false);
    onSelect(item);
    onChange?.(item.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < items.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(items[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showDropdown && filteredItems.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredItems.map((item, index) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === highlightedIndex ? "bg-blue-50" : ""
              }`}
            >
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">{item.type}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
