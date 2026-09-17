// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ExperienceSection } from "../sections/ExperienceSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin ExperienceSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders companies list and Add Company button", () => {
    render(
      <MemoryRouter>
        <ExperienceSection
          companies={initialPortfolioData.experience}
          onChange={vi.fn()}
          onOpenAddCompanyModal={vi.fn()}
          onOpenAddRoleModal={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/career experience/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /add company/i })).not.toBeNull();
  });

  it("calls onOpenAddCompanyModal when Add Company is clicked", () => {
    const handleAdd = vi.fn();
    render(
      <MemoryRouter>
        <ExperienceSection
          companies={initialPortfolioData.experience}
          onChange={vi.fn()}
          onOpenAddCompanyModal={handleAdd}
          onOpenAddRoleModal={vi.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /add company/i }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
