// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EducationSection } from "../sections/EducationSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin EducationSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders education list and Add Education button", () => {
    render(
      <MemoryRouter>
        <EducationSection
          education={initialPortfolioData.education}
          onChange={vi.fn()}
          onOpenAddModal={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/academic background/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /add education/i })).not.toBeNull();
  });

  it("calls onOpenAddModal when Add Education is clicked", () => {
    const handleAdd = vi.fn();
    render(
      <MemoryRouter>
        <EducationSection
          education={initialPortfolioData.education}
          onChange={vi.fn()}
          onOpenAddModal={handleAdd}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /add education/i }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
