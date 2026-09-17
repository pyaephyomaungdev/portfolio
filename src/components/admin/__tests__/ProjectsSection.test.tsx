// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ProjectsSection } from "../sections/ProjectsSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin ProjectsSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders projects list, search input, and Add Project button", () => {
    render(
      <ProjectsSection
        projects={initialPortfolioData.projects}
        onChange={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText(/filter projects/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /add project/i })).not.toBeNull();
  });

  it("filters project list when searching by keyword", () => {
    render(
      <ProjectsSection
        projects={initialPortfolioData.projects}
        onChange={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/filter projects/i);
    fireEvent.change(searchInput, { target: { value: "json-link" } });

    expect(screen.getAllByDisplayValue("json-link").length).toBeGreaterThanOrEqual(1);
  });

  it("calls onOpenAddModal when Add Project button is clicked", () => {
    const handleAdd = vi.fn();
    render(
      <ProjectsSection
        projects={initialPortfolioData.projects}
        onChange={vi.fn()}
        onOpenAddModal={handleAdd}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /add project/i }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });
});
