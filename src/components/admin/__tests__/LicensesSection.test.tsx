// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LicensesSection } from "../sections/LicensesSection";
import { initialPortfolioData } from "../../../data/portfolioData";

describe("Admin LicensesSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders licenses list and Add Certification button", () => {
    render(
      <MemoryRouter>
        <LicensesSection
          licenses={initialPortfolioData.licenses}
          onChange={vi.fn()}
          onOpenAddModal={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/certifications & credentials/i)).not.toBeNull();
    expect(screen.getByRole("button", { name: /add certification/i })).not.toBeNull();
  });

  it("calls onOpenAddModal when Add Certification button is clicked", () => {
    const handleAdd = vi.fn();
    render(
      <MemoryRouter>
        <LicensesSection
          licenses={initialPortfolioData.licenses}
          onChange={vi.fn()}
          onOpenAddModal={handleAdd}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /add certification/i }));
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it("displays empty placeholder when licenses list is empty", () => {
    render(
      <MemoryRouter>
        <LicensesSection
          licenses={[]}
          onChange={vi.fn()}
          onOpenAddModal={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/no certifications recorded yet/i)
    ).not.toBeNull();
  });

  it("triggers onChange when license name is modified in dedicated editor", () => {
    const handleChange = vi.fn();
    render(
      <MemoryRouter>
        <LicensesSection
          licenses={initialPortfolioData.licenses}
          onChange={handleChange}
          onOpenAddModal={vi.fn()}
        />
      </MemoryRouter>
    );

    const editBtns = screen.getAllByRole("button", { name: /edit/i });
    expect(editBtns.length).toBeGreaterThan(0);
    fireEvent.click(editBtns[0]);

    const nameInput = screen.getByPlaceholderText(/e\.g\. aws certified/i);
    fireEvent.change(nameInput, { target: { value: "Updated Certification" } });

    const saveBtn = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(saveBtn);

    expect(handleChange).toHaveBeenCalled();
  });
});
