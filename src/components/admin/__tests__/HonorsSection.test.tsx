// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { HonorsSection } from "../sections/HonorsSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin HonorsSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders honors list and Add Honor button", () => {
    render(
      <HonorsSection
        honors={initialPortfolioData.honors}
        onChange={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    expect(screen.getByText(/honors & awards/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /add honor/i })).not.toBeNull();
  });

  it("calls onOpenAddModal when Add Honor button is clicked", () => {
    const handleAdd = vi.fn();
    render(
      <HonorsSection
        honors={initialPortfolioData.honors}
        onChange={vi.fn()}
        onOpenAddModal={handleAdd}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /add honor/i }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
