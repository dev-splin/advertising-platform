import { z } from "zod";
import { getToday, addDaysToDate } from "@/src/lib/utils/date";

/**
 * 계약 생성 폼 스키마
 */
export const contractFormSchema = z
  .object({
    companyId: z.number().min(1, "업체를 선택해주세요."),
    startDate: z.string().trim().nonempty("계약 시작일을 선택해주세요."),
    endDate: z.string().trim().nonempty("계약 종료일을 선택해주세요."),
    amount: z.string().trim().nonempty("계약 금액을 입력해주세요."),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const today = new Date(getToday());
      return startDate >= today;
    },
    {
      message: "계약 시작일은 오늘 이후여야 합니다.",
      path: ["startDate"],
    },
  )
  .refine(
    (data) => {
      const endDate = new Date(data.endDate);
      const minEndDate = new Date(addDaysToDate(data.startDate, 28));
      return endDate >= minEndDate;
    },
    {
      message: "계약 종료일은 계약 시작일로부터 최소 28일 이후여야 합니다.",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      const amountNum = parseInt(data.amount.replace(/,/g, ""), 10);
      return !isNaN(amountNum) && amountNum >= 10000 && amountNum <= 1000000;
    },
    {
      message: "계약 금액은 10,000원 이상 1,000,000원 이하여야 합니다.",
      path: ["amount"],
    },
  );

export type ContractFormData = z.infer<typeof contractFormSchema>;
