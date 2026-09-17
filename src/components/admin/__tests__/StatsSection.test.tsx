// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { StatsSection } from "../sections/StatsSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin StatsSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders stats list and Add Stat button", () => {
    render(
      <StatsSection
        stats={initialPortfolioData.stats}
        onChange={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    expect(screen.getByText(/key stats/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /add stat/i })).not.toBeNull();
  });

  it("calls onOpenAddModal when Add Stat is clicked", () => {
    const handleAdd = vi.fn();
    render(
      <StatsSection
        stats={initialPortfolioData.stats}
        onChange={vi.fn()}
        onOpenAddModal={handleAdd}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /add stat/i }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
