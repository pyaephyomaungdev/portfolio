// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ProjectCategoryFilter } from "../ProjectCategoryFilter";

describe("ProjectCategoryFilter UI Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mockCategories = [
    { name: "All", count: 8 },
    { name: "Full-Stack", count: 4 },
    { name: "Dev Tools", count: 3 },
    { name: "Systems", count: 1 },
  ];

  it("renders all category chips with their counts", () => {
    render(
      <ProjectCategoryFilter
        categories={mockCategories}
        selectedCategory="All"
        onSelectCategory={vi.fn()}
      />
    );

    expect(screen.getByText("All")).not.toBeNull();
    expect(screen.getByText("8")).not.toBeNull();
    expect(screen.getByText("Full-Stack")).not.toBeNull();
    expect(screen.getByText("4")).not.toBeNull();
    expect(screen.getByText("Dev Tools")).not.toBeNull();
    expect(screen.getByText("3")).not.toBeNull();
    expect(screen.getByText("Systems")).not.toBeNull();
    expect(screen.getByText("1")).not.toBeNull();
  });

  it("calls onSelectCategory when a category is clicked", () => {
    const handleSelectCategory = vi.fn();
    render(
      <ProjectCategoryFilter
        categories={mockCategories}
        selectedCategory="All"
        onSelectCategory={handleSelectCategory}
      />
    );

    const devToolsBtn = screen.getByRole("button", { name: /dev tools/i });
    fireEvent.click(devToolsBtn);

    expect(handleSelectCategory).toHaveBeenCalledWith("Dev Tools");
  });

  it("highlights the currently active category", () => {
    render(
      <ProjectCategoryFilter
        categories={mockCategories}
        selectedCategory="Full-Stack"
        onSelectCategory={vi.fn()}
      />
    );

    const activeBtn = screen.getByRole("button", { name: /full-stack/i });
    // Active chip has primary button styling
    expect(activeBtn.className).toContain("btn-primary");
  });
});
