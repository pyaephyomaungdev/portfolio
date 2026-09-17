// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { OverviewSection } from "../sections/OverviewSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin OverviewSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders status radar, project count metrics, and quick jump cards", () => {
    render(
      <MemoryRouter>
        <OverviewSection
          portfolio={initialPortfolioData}
          onUpdateAvailability={vi.fn()}
          onNavigateTab={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("System Overview")).not.toBeNull();
    expect(screen.getByText("Availability Quick Switcher")).not.toBeNull();
    expect(screen.getAllByText("Projects").length).toBeGreaterThanOrEqual(1);
  });

  it("calls onNavigateTab when clicking quick jump section links", () => {
    const handleNavigate = vi.fn();
    render(
      <MemoryRouter>
        <OverviewSection
          portfolio={initialPortfolioData}
          onUpdateAvailability={vi.fn()}
          onNavigateTab={handleNavigate}
        />
      </MemoryRouter>
    );

    const projectButtons = screen.getAllByRole("button", { name: /projects/i });
    if (projectButtons[0]) {
      fireEvent.click(projectButtons[0]);
      expect(handleNavigate).toHaveBeenCalledWith("projects");
    }
  });
});
