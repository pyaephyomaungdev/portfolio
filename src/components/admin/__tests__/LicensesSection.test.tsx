// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { LicensesSection } from "../sections/LicensesSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin LicensesSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders licenses list and Add Certification button", () => {
    render(
      <LicensesSection
        licenses={initialPortfolioData.licenses}
        onChange={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    expect(screen.getByText(/certifications & licenses/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /add certification/i })).not.toBeNull();
  });

  it("calls onOpenAddModal when Add Certification button is clicked", () => {
    const handleAdd = vi.fn();
    render(
      <LicensesSection
        licenses={initialPortfolioData.licenses}
        onChange={vi.fn()}
        onOpenAddModal={handleAdd}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /add certification/i }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it("displays empty placeholder when licenses list is empty", () => {
    render(
      <LicensesSection
        licenses={[]}
        onChange={vi.fn()}
        onOpenAddModal={vi.fn()}
      />
    );

    expect(
      screen.getByText(/no certifications or licenses configured yet/i)
    ).not.toBeNull();
  });

  it("triggers onChange when license name is modified", () => {
    const handleChange = vi.fn();
    render(
      <LicensesSection
        licenses={initialPortfolioData.licenses}
        onChange={handleChange}
        onOpenAddModal={vi.fn()}
      />
    );

    const nameInputs = screen.getAllByRole("textbox");
    if (nameInputs.length > 0) {
      fireEvent.change(nameInputs[0], { target: { value: "Updated Certification" } });
      expect(handleChange).toHaveBeenCalled();
    }
  });
});
