// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HonorsSection } from "../sections/HonorsSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin HonorsSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders honors list and Add Award button", () => {
    render(
      <MemoryRouter>
        <HonorsSection
          honors={initialPortfolioData.honors}
          onChange={vi.fn()}
          onOpenAddModal={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/honors & awards/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /add award/i })).not.toBeNull();
  });

  it("calls onOpenAddModal when Add Award button is clicked", () => {
    const handleAdd = vi.fn();
    render(
      <MemoryRouter>
        <HonorsSection
          honors={initialPortfolioData.honors}
          onChange={vi.fn()}
          onOpenAddModal={handleAdd}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /add award/i }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
