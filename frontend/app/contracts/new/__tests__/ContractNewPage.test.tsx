import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getToday, addDaysToDate } from "@/src/lib/utils/date";
import ContractNewPage from "../page";
import * as useProductsHook from "@/src/lib/api/hooks/useProducts";
import * as useCompaniesHook from "@/src/lib/api/hooks/useCompanies";
import * as useContractsHook from "@/src/lib/api/hooks/useContracts";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(() => ({
    get: vi.fn((key: string) => (key === "productId" ? "1" : null)),
  })),
}));

vi.mock("@/src/lib/api/hooks/useProducts");
vi.mock("@/src/lib/api/hooks/useCompanies");
vi.mock("@/src/lib/api/hooks/useContracts");

const mockProduct = {
  id: 1,
  name: "노출 보장형 광고",
  description: "테스트 상품 설명",
};

const mockCompanies = [
  { id: 1, companyNumber: "10001", name: "테스트 호텔", type: "호텔" },
  { id: 2, companyNumber: "10002", name: "테스트 펜션", type: "펜션" },
];

describe("ContractNewPage", () => {
  let queryClient: QueryClient;
  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.mocked(useRouter).mockReturnValue(mockRouter as any);
    vi.mocked(useProductsHook.useProduct).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompaniesHook.useCompanies).mockReturnValue({
      data: mockCompanies,
    } as any);
    vi.mocked(useContractsHook.useCreateContract).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ id: 1 }),
      isPending: false,
    } as any);
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ContractNewPage />
      </QueryClientProvider>,
    );
  };

  it("계약 폼이 렌더링되어야 함", () => {
    renderComponent();

    expect(screen.getByText("광고 계약")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("업체를 선택하세요")).toBeInTheDocument();
    expect(screen.getByText(/계약 시작일/)).toBeInTheDocument();
    expect(screen.getByText(/계약 종료일/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("100,000")).toBeInTheDocument();
  });

  it("제출 버튼이 초기에는 비활성화되어야 함", () => {
    renderComponent();

    const submitButton = screen.getByRole("button", { name: /계약/i });
    expect(submitButton).toBeDisabled();
  });

  it("모든 필수 필드 입력 시 제출 버튼이 활성화되어야 함", async () => {
    const user = userEvent.setup();
    renderComponent();

    const companyInput = screen.getByPlaceholderText("업체를 선택하세요");
    const startDateInput = screen.getByLabelText(/계약 시작일/);
    const endDateInput = screen.getByLabelText(/계약 종료일/);
    const amountInput = screen.getByPlaceholderText("100,000");

    await user.type(companyInput, "테스트 호텔");
    await user.click(screen.getByText("테스트 호텔"));

    const today = new Date().toISOString().split("T")[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 28);
    const endDate = futureDate.toISOString().split("T")[0];

    await user.clear(startDateInput);
    await user.type(startDateInput, today);
    await user.clear(endDateInput);
    await user.type(endDateInput, endDate);
    await user.type(amountInput, "100000");

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /계약/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("업체 미선택 시 버튼이 비활성화되어야 함", () => {
    renderComponent();

    const submitButton = screen.getByRole("button", { name: /계약/i });
    expect(submitButton).toBeDisabled();
  });

  it("업체 선택 후 제거 시 유효성 검사 에러가 표시되어야 함", async () => {
    const user = userEvent.setup();
    renderComponent();

    const companyInput = screen.getByPlaceholderText("업체를 선택하세요");
    await user.type(companyInput, "테스트 호텔");
    await user.click(screen.getByText("테스트 호텔"));

    const today = new Date().toISOString().split("T")[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 28);
    const endDate = futureDate.toISOString().split("T")[0];

    const startDateInput = screen.getByLabelText(/계약 시작일/);
    const endDateInput = screen.getByLabelText(/계약 종료일/);
    const amountInput = screen.getByPlaceholderText("100,000");

    await user.clear(startDateInput);
    await user.type(startDateInput, today);
    await user.clear(endDateInput);
    await user.type(endDateInput, endDate);
    await user.type(amountInput, "100000");

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /계약/i });
      expect(submitButton).not.toBeDisabled();
    });

    await user.clear(companyInput);
    
    await waitFor(
      () => {
        expect(screen.getByText(/업체를 선택해주세요/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("시작일이 오늘 이전일 때 유효성 검사 에러가 표시되어야 함", async () => {
    const user = userEvent.setup();
    renderComponent();

    const companyInput = screen.getByPlaceholderText("업체를 선택하세요");
    await user.type(companyInput, "테스트 호텔");
    await user.click(screen.getByText("테스트 호텔"));

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDate = yesterday.toISOString().split("T")[0];

    const startDateInput = screen.getByLabelText(/계약 시작일/);
    await user.clear(startDateInput);
    await user.type(startDateInput, pastDate);

    await waitFor(() => {
      expect(
        screen.getByText(/계약 시작일은 오늘 이후여야 합니다/i),
      ).toBeInTheDocument();
    });
  });

  it("종료일이 시작일 + 28일 미만일 때 유효성 검사 에러가 표시되어야 함", async () => {
    const user = userEvent.setup();
    renderComponent();

    const companyInput = screen.getByPlaceholderText("업체를 선택하세요");
    await user.type(companyInput, "테스트 호텔");
    await user.click(screen.getByText("테스트 호텔"));

    const today = new Date().toISOString().split("T")[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 20);
    const invalidEndDate = futureDate.toISOString().split("T")[0];

    const startDateInput = screen.getByLabelText(/계약 시작일/);
    const endDateInput = screen.getByLabelText(/계약 종료일/);

    await user.clear(startDateInput);
    await user.type(startDateInput, today);
    await user.clear(endDateInput);
    await user.type(endDateInput, invalidEndDate);

    await waitFor(() => {
      expect(
        screen.getByText(/계약 종료일은 계약 시작일로부터 최소 28일 이후여야 합니다/i),
      ).toBeInTheDocument();
    });
  });

  it("금액이 최소 금액 미만일 때 유효성 검사 에러가 표시되어야 함", async () => {
    const user = userEvent.setup();
    renderComponent();

    const companyInput = screen.getByPlaceholderText("업체를 선택하세요");
    await user.type(companyInput, "테스트 호텔");
    await user.click(screen.getByText("테스트 호텔"));

    const amountInput = screen.getByPlaceholderText("100,000");
    await user.type(amountInput, "9999");

    await waitFor(() => {
      expect(
        screen.getByText(/계약 금액은 10,000원 이상 1,000,000원 이하여야 합니다/i),
      ).toBeInTheDocument();
    });
  });

  it("금액이 최대 금액 초과일 때 유효성 검사 에러가 표시되어야 함", async () => {
    const user = userEvent.setup();
    renderComponent();

    const companyInput = screen.getByPlaceholderText("업체를 선택하세요");
    await user.type(companyInput, "테스트 호텔");
    await user.click(screen.getByText("테스트 호텔"));

    const amountInput = screen.getByPlaceholderText("100,000");
    await user.type(amountInput, "1000001");

    await waitFor(() => {
      expect(
        screen.getByText(/계약 금액은 10,000원 이상 1,000,000원 이하여야 합니다/i),
      ).toBeInTheDocument();
    });
  });

  it("유효한 입력값으로 계약 생성이 성공해야 함", async () => {
    const user = userEvent.setup();
    const mockMutateAsync = vi.fn().mockResolvedValue({ id: 1 });
    vi.mocked(useContractsHook.useCreateContract).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    } as any);

    renderComponent();

    const companyInput = screen.getByPlaceholderText("업체를 선택하세요");
    await user.type(companyInput, "테스트 호텔");
    await user.click(screen.getByText("테스트 호텔"));

    const today = new Date().toISOString().split("T")[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 28);
    const endDate = futureDate.toISOString().split("T")[0];

    const startDateInput = screen.getByLabelText(/계약 시작일/);
    const endDateInput = screen.getByLabelText(/계약 종료일/);
    const amountInput = screen.getByPlaceholderText("100,000");

    await user.clear(startDateInput);
    await user.type(startDateInput, today);
    await user.clear(endDateInput);
    await user.type(endDateInput, endDate);
    await user.type(amountInput, "100000");

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /계약/i });
      expect(submitButton).not.toBeDisabled();
    });

    const submitButton = screen.getByRole("button", { name: /계약/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: 1,
          productId: 1,
          startDate: today,
          endDate: endDate,
          amount: 100000,
        }),
      );
    });
  });
});
