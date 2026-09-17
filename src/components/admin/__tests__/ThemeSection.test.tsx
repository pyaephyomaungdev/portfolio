// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ThemeSection } from "../sections/ThemeSection";

describe("ThemeSection Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders theme studio header, palettes, fonts, and live preview", () => {
    render(
      <ThemeSection
        themeConfig={{
          preset: "signal-orange",
          accentColor: "#f54e00",
          accentColorDark: "#ff5c1a",
          fontPairing: "editorial",
          radiusStyle: "tactile",
          defaultMode: "system",
        }}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("Theme & Aesthetic Studio")).not.toBeNull();
    expect(screen.getAllByText("Signal Orange").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Electric Cyan").length).toBeGreaterThan(0);
    expect(screen.getByText("Editorial Swiss")).not.toBeNull();
    expect(screen.getByText("Live Design System Simulator")).not.toBeNull();
  });

  it("calls onChange when selecting Electric Cyan preset", () => {
    const handleChange = vi.fn();
    render(
      <ThemeSection
        themeConfig={{
          preset: "signal-orange",
          accentColor: "#f54e00",
        }}
        onChange={handleChange}
      />
    );

    const cyanBtn = screen.getByRole("button", { name: /theme preset: electric cyan/i });
    fireEvent.click(cyanBtn);

    expect(handleChange).toHaveBeenCalled();
    const updated = handleChange.mock.calls[0][0];
    expect(updated.preset).toBe("electric-cyan");
    expect(updated.primaryColor).toBe("#0284c7");
    expect(updated.accentColor).toBe("#f59e0b");
  });

  it("calls onChange when selecting Modern Bauhaus font", () => {
    const handleChange = vi.fn();
    render(
      <ThemeSection
        themeConfig={{
          fontPairing: "editorial",
        }}
        onChange={handleChange}
      />
    );

    const modernFontBtn = screen.getByRole("button", { name: /modern bauhaus/i });
    fireEvent.click(modernFontBtn);

    expect(handleChange).toHaveBeenCalled();
    const updated = handleChange.mock.calls[0][0];
    expect(updated.fontPairing).toBe("modern");
  });

  it("resets to default settings when clicking Reset Defaults", () => {
    const handleChange = vi.fn();
    render(
      <ThemeSection
        themeConfig={{
          preset: "cyber-violet",
          accentColor: "#7c3aed",
        }}
        onChange={handleChange}
      />
    );

    const resetBtn = screen.getByRole("button", { name: /reset defaults/i });
    fireEvent.click(resetBtn);

    expect(handleChange).toHaveBeenCalledWith({
      preset: "signal-orange",
      primaryColor: "#f54e00",
      primaryColorDark: "#ff5c1a",
      accentColor: "#0284c7",
      accentColorDark: "#38bdf8",
      fontPairing: "editorial",
      radiusStyle: "tactile",
      defaultMode: "system",
    });
  });

  it("calls onChange when selecting a primary button color swatch", () => {
    const handleChange = vi.fn();
    render(
      <ThemeSection
        themeConfig={{
          preset: "signal-orange",
          primaryColor: "#f54e00",
          accentColor: "#f54e00",
        }}
        onChange={handleChange}
      />
    );

    const inkSwatchBtn = screen.getByRole("button", { name: /ink black/i });
    fireEvent.click(inkSwatchBtn);

    expect(handleChange).toHaveBeenCalled();
    const updated = handleChange.mock.calls[0][0];
    expect(updated.preset).toBe("custom");
    expect(updated.primaryColor).toBe("#18181b");
  });

  it("applies smart suggested accent when clicking Apply Suggestion", () => {
    const handleChange = vi.fn();
    render(
      <ThemeSection
        themeConfig={{
          preset: "custom",
          primaryColor: "#0284c7", // Electric cyan -> complementary hue is warm orange/amber
          accentColor: "#0284c7",  // not matching the suggestion yet
        }}
        onChange={handleChange}
      />
    );

    const applyBtn = screen.getByRole("button", { name: /apply suggestion/i });
    fireEvent.click(applyBtn);

    expect(handleChange).toHaveBeenCalled();
    const updated = handleChange.mock.calls[0][0];
    expect(updated.accentColor).toBeDefined();
    expect(updated.accentColor).not.toBe("#0284c7");
  });
});
