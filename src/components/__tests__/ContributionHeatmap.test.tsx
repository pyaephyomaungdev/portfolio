// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import { ContributionHeatmap } from "../ContributionHeatmap";

describe("ContributionHeatmap UI Component", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("returns null when githubUrl is empty or null", () => {
    const { container } = render(<ContributionHeatmap githubUrl={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders heatmap container with current year tab when githubUrl is provided", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        total: 150,
        contributions: [],
      }),
    } as Response);

    const currentYear = new Date().getUTCFullYear();
    render(<ContributionHeatmap githubUrl="https://github.com/pyaephyomaungdev" />);

    await waitFor(() => {
      expect(screen.getByText(String(currentYear))).not.toBeNull();
    });
  });
});
