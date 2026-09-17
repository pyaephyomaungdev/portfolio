// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { LayoutSection } from "../sections/LayoutSection";

describe("Admin LayoutSection UI Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders section visibility header, counters, and section switches", () => {
    render(
      <LayoutSection
        visibility={{
          projects: true,
          experience: true,
          education: true,
          licenses: false,
        }}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("Section Visibility")).not.toBeNull();
    expect(screen.getByText(/selected work & projects/i)).not.toBeNull();
    expect(screen.getByText(/career experience/i)).not.toBeNull();
    expect(screen.getByText(/academic background/i)).not.toBeNull();
    expect(screen.getByText(/github contribution heatmap/i)).not.toBeNull();
  });

  it("calls onChange with toggled key when a switch is clicked", () => {
    const handleChange = vi.fn();
    render(
      <LayoutSection
        visibility={{
          projects: true,
          experience: true,
        }}
        onChange={handleChange}
      />
    );

    const projectSwitch = screen.getByRole("switch", { name: /toggle selected work & projects/i });
    fireEvent.click(projectSwitch);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        projects: false,
      })
    );
  });

  it("calls onChange enabling all sections when Show All is clicked", () => {
    const handleChange = vi.fn();
    render(
      <LayoutSection
        visibility={{
          projects: false,
          experience: false,
        }}
        onChange={handleChange}
      />
    );

    const showAllBtn = screen.getByRole("button", { name: /show all/i });
    fireEvent.click(showAllBtn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        projects: true,
        experience: true,
        education: true,
        licenses: true,
      })
    );
  });

  it("calls onChange with defaults when Reset is clicked", () => {
    const handleChange = vi.fn();
    render(
      <LayoutSection
        visibility={{
          projects: false,
          contact: false,
        }}
        onChange={handleChange}
      />
    );

    const resetBtn = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetBtn);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        projects: true,
        contact: true,
      })
    );
  });
});
