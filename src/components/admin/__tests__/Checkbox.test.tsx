// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Checkbox } from "../Checkbox";

describe("Admin Checkbox Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with role='checkbox' and reflects checked state", () => {
    render(<Checkbox checked={true} onChange={vi.fn()} label="Enable feature" />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeNull();
    expect(checkbox.getAttribute("aria-checked")).toBe("true");
    expect(screen.getByText("Enable feature")).not.toBeNull();
  });

  it("calls onChange when clicked", () => {
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} label="Toggle option" />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it("toggles on Enter or Space key down", () => {
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} label="Toggle option" />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.keyDown(checkbox, { key: " " });
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
