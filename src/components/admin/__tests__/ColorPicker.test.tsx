// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ColorPicker } from "../ColorPicker";

describe("ColorPicker Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders with given hex value and updates on input change", () => {
    const handleChange = vi.fn();
    render(<ColorPicker value="#f54e00" onChange={handleChange} />);

    const input = screen.getByLabelText("Hex color value") as HTMLInputElement;
    expect(input.value).toBe("#f54e00");

    fireEvent.change(input, { target: { value: "#0284c7" } });
    expect(handleChange).toHaveBeenCalledWith("#0284c7");
  });

  it("handles input without leading hash correctly", () => {
    const handleChange = vi.fn();
    render(<ColorPicker value="#18181b" onChange={handleChange} />);

    const input = screen.getByLabelText("Hex color value") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "059669" } });
    expect(handleChange).toHaveBeenCalledWith("#059669");
  });
});
