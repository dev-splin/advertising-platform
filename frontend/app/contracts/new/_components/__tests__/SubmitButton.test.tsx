import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SubmitButton from "../SubmitButton";

describe("SubmitButton", () => {
  it("버튼이 렌더링되어야 합니다", () => {
    render(<SubmitButton isDisabled={false} />);
    const button = screen.getByRole("button", { name: "계약" });
    expect(button).toBeInTheDocument();
  });

  it("버튼이 활성화 상태일 때 올바른 스타일을 가져야 합니다", () => {
    render(<SubmitButton isDisabled={false} />);
    const button = screen.getByRole("button", { name: "계약" });

    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("bg-blue-600");
    expect(button).toHaveClass("hover:bg-blue-700");
    expect(button).toHaveClass("text-white");
  });

  it("버튼이 비활성화 상태일 때 disabled 속성을 가져야 합니다", () => {
    render(<SubmitButton isDisabled={true} />);
    const button = screen.getByRole("button", { name: "계약" });

    expect(button).toBeDisabled();
    expect(button).toHaveClass("bg-gray-400");
    expect(button).toHaveClass("cursor-not-allowed");
  });

  it("버튼이 submit 타입이어야 합니다", () => {
    render(<SubmitButton isDisabled={false} />);
    const button = screen.getByRole("button", { name: "계약" });

    expect(button).toHaveAttribute("type", "submit");
  });
});
