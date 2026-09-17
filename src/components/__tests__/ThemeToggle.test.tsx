// @vitest-environment jsdom
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeToggle } from "../ThemeToggle";
import { ThemeProvider } from "../../context/ThemeContext";

describe("ThemeToggle UI Component", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("renders toggle button with accessible aria-label", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).not.toBeNull();
    expect(button.getAttribute("aria-label")).toMatch(/switch to (dark|light) theme/i);
  });

  it("displays text label when showLabel prop is true", () => {
    render(
      <ThemeProvider>
        <ThemeToggle showLabel />
      </ThemeProvider>
    );

    const label = screen.getByText(/dark|light/i);
    expect(label).not.toBeNull();
  });

  it("toggles theme on click and updates aria-label", () => {
    render(
      <ThemeProvider>
        <ThemeToggle showLabel />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    const initialLabel = button.getAttribute("aria-label");

    fireEvent.click(button);

    const newLabel = button.getAttribute("aria-label");
    expect(newLabel).not.toBe(initialLabel);
  });
});
