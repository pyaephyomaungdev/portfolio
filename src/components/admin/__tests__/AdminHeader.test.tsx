// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { AdminHeader } from "../AdminHeader";
import { ThemeProvider } from "../../../context/ThemeContext";

describe("AdminHeader UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    statusMessage: null,
    onRevert: vi.fn(),
    onSave: vi.fn(),
    onExport: vi.fn(),
    onImport: vi.fn(),
    isSaving: false,
    hasErrors: false,
    isDirty: false,
  };

  it("renders header title and Save action button", () => {
    render(
      <ThemeProvider>
        <AdminHeader {...defaultProps} />
      </ThemeProvider>
    );

    expect(screen.getByText("Portfolio Admin")).not.toBeNull();
    expect(screen.getByRole("button", { name: /save/i })).not.toBeNull();
  });

  it("shows Unsaved indicator when isDirty is true", () => {
    render(
      <ThemeProvider>
        <AdminHeader {...defaultProps} isDirty={true} />
      </ThemeProvider>
    );

    expect(screen.getByText(/unsaved/i)).not.toBeNull();
  });

  it("calls onSave when Save button is clicked", () => {
    const handleSave = vi.fn();
    render(
      <ThemeProvider>
        <AdminHeader {...defaultProps} onSave={handleSave} isDirty={true} />
      </ThemeProvider>
    );

    const saveBtn = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalledTimes(1);
  });
});
