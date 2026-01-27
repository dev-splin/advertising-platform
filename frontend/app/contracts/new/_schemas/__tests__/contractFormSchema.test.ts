import { describe, it, expect, beforeEach, vi } from "vitest";
import { contractFormSchema } from "../contractFormSchema";
import { getToday, addDaysToDate } from "@/src/lib/utils/date";

// date 유틸리티 함수 모킹
vi.mock("@/src/lib/utils/date", () => ({
  getToday: vi.fn(() => "2024-01-15"),
  addDaysToDate: vi.fn((date: string, days: number) => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj.toISOString().split("T")[0];
  }),
}));

describe("contractFormSchema", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("기본 필드 검증", () => {
    it("모든 필수 필드가 올바르면 통과해야 합니다", async () => {
      const validData = {
        companyId: 1,
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        amount: "50000",
      };

      const result = await contractFormSchema.safeParseAsync(validData);
      expect(result.success).toBe(true);
    });

    it("companyId가 0이면 실패해야 합니다", async () => {
      const invalidData = {
        companyId: 0,
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        amount: "50000",
      };

      const result = await contractFormSchema.safeParseAsync(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe("업체를 선택해주세요.");
      }
    });

    it("startDate가 비어있으면 실패해야 합니다", async () => {
      const invalidData = {
        companyId: 1,
        startDate: "",
        endDate: "2024-02-20",
        amount: "50000",
      };

      const result = await contractFormSchema.safeParseAsync(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "계약 시작일을 선택해주세요.",
        );
      }
    });

    it("endDate가 비어있으면 실패해야 합니다", async () => {
      const invalidData = {
        companyId: 1,
        startDate: "2024-01-20",
        endDate: "",
        amount: "50000",
      };

      const result = await contractFormSchema.safeParseAsync(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "계약 종료일을 선택해주세요.",
        );
      }
    });

    it("amount가 비어있으면 실패해야 합니다", async () => {
      const invalidData = {
        companyId: 1,
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        amount: "",
      };

      const result = await contractFormSchema.safeParseAsync(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          "계약 금액을 입력해주세요.",
        );
      }
    });
  });

  describe("시작일 검증", () => {
    it("시작일이 오늘 이후여야 합니다", async () => {
      const today = "2024-01-15";
      vi.mocked(getToday).mockReturnValue(today);

      const invalidData = {
        companyId: 1,
        startDate: "2024-01-14", // 어제
        endDate: "2024-02-14",
        amount: "50000",
      };

      const result = await contractFormSchema.safeParseAsync(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const startDateError = result.error.errors.find(
          (e) => e.path[0] === "startDate",
        );
        expect(startDateError?.message).toBe(
          "계약 시작일은 오늘 이후여야 합니다.",
        );
      }
    });

    it("시작일이 오늘이면 통과해야 합니다", async () => {
      const today = "2024-01-15";
      vi.mocked(getToday).mockReturnValue(today);

      const validData = {
        companyId: 1,
        startDate: today,
        endDate: "2024-02-15",
        amount: "50000",
      };

      const result = await contractFormSchema.safeParseAsync(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("종료일 검증", () => {
    it("종료일이 시작일로부터 최소 28일 이후여야 합니다", async () => {
      const startDate = "2024-01-20";
      const minEndDate = "2024-02-17"; // 28일 후

      vi.mocked(addDaysToDate).mockReturnValue(minEndDate);

      const invalidData = {
        companyId: 1,
        startDate,
        endDate: "2024-02-16", // 27일 후 (부족함)
        amount: "50000",
      };

      const result = await contractFormSchema.safeParseAsync(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const endDateError = result.error.errors.find(
          (e) => e.path[0] === "endDate",
        );
        expect(endDateError?.message).toBe(
          "계약 종료일은 계약 시작일로부터 최소 28일 이후여야 합니다.",
        );
      }
    });

    it("종료일이 시작일로부터 정확히 28일 후면 통과해야 합니다", async () => {
      const startDate = "2024-01-20";
      const minEndDate = "2024-02-17"; // 28일 후

      vi.mocked(addDaysToDate).mockReturnValue(minEndDate);

      const validData = {
        companyId: 1,
        startDate,
        endDate: minEndDate,
        amount: "50000",
      };

      const result = await contractFormSchema.safeParseAsync(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("금액 검증", () => {
    it("금액이 10,000원 미만이면 실패해야 합니다", async () => {
      const invalidData = {
        companyId: 1,
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        amount: "9999",
      };

      const result = await contractFormSchema.safeParseAsync(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const amountError = result.error.errors.find(
          (e) => e.path[0] === "amount",
        );
        expect(amountError?.message).toBe(
          "계약 금액은 10,000원 이상 1,000,000원 이하여야 합니다.",
        );
      }
    });

    it("금액이 1,000,000원 초과면 실패해야 합니다", async () => {
      const invalidData = {
        companyId: 1,
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        amount: "1000001",
      };

      const result = await contractFormSchema.safeParseAsync(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const amountError = result.error.errors.find(
          (e) => e.path[0] === "amount",
        );
        expect(amountError?.message).toBe(
          "계약 금액은 10,000원 이상 1,000,000원 이하여야 합니다.",
        );
      }
    });

    it("금액이 10,000원이면 통과해야 합니다", async () => {
      const validData = {
        companyId: 1,
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        amount: "10000",
      };

      const result = await contractFormSchema.safeParseAsync(validData);
      expect(result.success).toBe(true);
    });

    it("금액이 1,000,000원이면 통과해야 합니다", async () => {
      const validData = {
        companyId: 1,
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        amount: "1000000",
      };

      const result = await contractFormSchema.safeParseAsync(validData);
      expect(result.success).toBe(true);
    });

    it("금액에 쉼표가 포함되어 있어도 올바르게 파싱해야 합니다", async () => {
      const validData = {
        companyId: 1,
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        amount: "50,000",
      };

      const result = await contractFormSchema.safeParseAsync(validData);
      expect(result.success).toBe(true);
    });

    it("금액이 숫자가 아니면 실패해야 합니다", async () => {
      const invalidData = {
        companyId: 1,
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        amount: "abc",
      };

      const result = await contractFormSchema.safeParseAsync(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const amountError = result.error.errors.find(
          (e) => e.path[0] === "amount",
        );
        expect(amountError?.message).toBe(
          "계약 금액은 10,000원 이상 1,000,000원 이하여야 합니다.",
        );
      }
    });
  });
});
