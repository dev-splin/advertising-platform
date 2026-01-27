import { describe, it, expect, beforeEach, vi } from "vitest";
import { formatDate, getToday, addDaysToDate, toDate } from "../date";
import { format, addDays, parseISO } from "date-fns";

// date-fns 모킹
vi.mock("date-fns", () => ({
  format: vi.fn(),
  addDays: vi.fn(),
  parseISO: vi.fn(),
}));

describe("date 유틸리티 함수", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("formatDate", () => {
    it("Date 객체를 YYYY-MM-DD 형식으로 포맷팅해야 합니다", () => {
      const date = new Date("2024-01-15T10:30:00");
      vi.mocked(parseISO).mockReturnValue(date);
      vi.mocked(format).mockReturnValue("2024-01-15");

      const result = formatDate(date);

      expect(parseISO).not.toHaveBeenCalled();
      expect(format).toHaveBeenCalledWith(date, "yyyy-MM-dd");
      expect(result).toBe("2024-01-15");
    });

    it("문자열 날짜를 YYYY-MM-DD 형식으로 포맷팅해야 합니다", () => {
      const dateString = "2024-01-15";
      const date = new Date(dateString);
      vi.mocked(parseISO).mockReturnValue(date);
      vi.mocked(format).mockReturnValue("2024-01-15");

      const result = formatDate(dateString);

      expect(parseISO).toHaveBeenCalledWith(dateString);
      expect(format).toHaveBeenCalledWith(date, "yyyy-MM-dd");
      expect(result).toBe("2024-01-15");
    });
  });

  describe("getToday", () => {
    it("오늘 날짜를 YYYY-MM-DD 형식으로 반환해야 합니다", () => {
      const today = new Date("2024-01-15T10:30:00");
      vi.mocked(format).mockReturnValue("2024-01-15");

      const result = getToday();

      expect(format).toHaveBeenCalledWith(expect.any(Date), "yyyy-MM-dd");
      expect(result).toBe("2024-01-15");
    });
  });

  describe("addDaysToDate", () => {
    it("Date 객체에 일수를 더한 날짜를 반환해야 합니다", () => {
      const date = new Date("2024-01-15");
      const addedDate = new Date("2024-01-20");
      vi.mocked(addDays).mockReturnValue(addedDate);
      vi.mocked(format).mockReturnValue("2024-01-20");

      const result = addDaysToDate(date, 5);

      expect(parseISO).not.toHaveBeenCalled();
      expect(addDays).toHaveBeenCalledWith(date, 5);
      expect(format).toHaveBeenCalledWith(addedDate, "yyyy-MM-dd");
      expect(result).toBe("2024-01-20");
    });

    it("문자열 날짜에 일수를 더한 날짜를 반환해야 합니다", () => {
      const dateString = "2024-01-15";
      const date = new Date(dateString);
      const addedDate = new Date("2024-01-20");
      vi.mocked(parseISO).mockReturnValue(date);
      vi.mocked(addDays).mockReturnValue(addedDate);
      vi.mocked(format).mockReturnValue("2024-01-20");

      const result = addDaysToDate(dateString, 5);

      expect(parseISO).toHaveBeenCalledWith(dateString);
      expect(addDays).toHaveBeenCalledWith(date, 5);
      expect(format).toHaveBeenCalledWith(addedDate, "yyyy-MM-dd");
      expect(result).toBe("2024-01-20");
    });

    it("음수 일수를 처리할 수 있어야 합니다", () => {
      const date = new Date("2024-01-15");
      const subtractedDate = new Date("2024-01-10");
      vi.mocked(addDays).mockReturnValue(subtractedDate);
      vi.mocked(format).mockReturnValue("2024-01-10");

      const result = addDaysToDate(date, -5);

      expect(addDays).toHaveBeenCalledWith(date, -5);
      expect(result).toBe("2024-01-10");
    });
  });

  describe("toDate", () => {
    it("날짜 문자열을 Date 객체로 변환해야 합니다", () => {
      const dateString = "2024-01-15";
      const date = new Date(dateString);
      vi.mocked(parseISO).mockReturnValue(date);

      const result = toDate(dateString);

      expect(parseISO).toHaveBeenCalledWith(dateString);
      expect(result).toEqual(date);
    });
  });
});
